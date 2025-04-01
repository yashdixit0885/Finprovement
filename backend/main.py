# backend/main.py

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, or_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy import ForeignKey

# ----- Database Setup -----
SQLALCHEMY_DATABASE_URL = "sqlite:///./users.db"  # Using SQLite for simplicity
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ----- Password Hashing Setup -----
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ====== Database Models =======

# ----- User Model -----
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

# ----- Questionnaire Model -----

class Questionnaire(Base):
    __tablename__ = "questionnaires"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)  # Ideally, use ForeignKey('users.id') in a full implementation
    investment_goal = Column(String)
    savings_habit = Column(String)
    risk_tolerance = Column(String)

# ----- Recommendation Model -----
class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)  # In a full app, use ForeignKey('users.id')
    description = Column(String)
    status = Column(String, default="pending")  # Values: "pending", "in_progress", "complete"


# Create the database tables
Base.metadata.create_all(bind=engine)

# ----- Pydantic Models -----
class UserCreate(BaseModel):
    email: str
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: str
    password: str
    
class QuestionnaireCreate(BaseModel):
    user_id: int
    investment_goal: str
    savings_habit: str
    risk_tolerance: str

class QuestionnaireResponse(BaseModel):
    id: int
    user_id: int
    investment_goal: str
    savings_habit: str
    risk_tolerance: str

    class Config:
        orm_mode = True
        

class AnalysisResponse(BaseModel):
    user_id: int
    summary: str
    risk_score: int
    investment_recommendation: str

class RecommendationCreate(BaseModel):
    user_id: int
    description: str

class RecommendationResponse(BaseModel):
    id: int
    user_id: int
    description: str
    status: str

    class Config:
        orm_mode = True

class RecommendationUpdate(BaseModel):
    status: str  # Allow updating the status


# ----- FastAPI App Initialization -----
app = FastAPI()

# Allow CORS for local development (adjust allowed origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # our React app runs on port 3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Utility functions for password handling
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# ----- API Endpoints -----

@app.post("/api/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if a user with the same email or username exists
    existing_user = db.query(User).filter(or_(User.email == user.email, User.username == user.username)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email or username already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = User(email=user.email, username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/api/login", response_model=UserResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    # Find the user by email
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    return db_user

@app.post("/api/questionnaire", response_model=QuestionnaireResponse)
def create_questionnaire(q: QuestionnaireCreate, db: Session = Depends(get_db)):
    db_q = Questionnaire(**q.dict())
    db.add(db_q)
    db.commit()
    db.refresh(db_q)
    return db_q

@app.get("/api/questionnaire/{user_id}", response_model=QuestionnaireResponse)
def get_questionnaire(user_id: int, db: Session = Depends(get_db)):
    db_q = db.query(Questionnaire).filter(Questionnaire.user_id == user_id).first()
    if not db_q:
        raise HTTPException(status_code=404, detail="Questionnaire not found")
    return db_q

# Create a new recommendation (for testing or admin purposes)
@app.post("/api/recommendations", response_model=RecommendationResponse)
def create_recommendation(rec: RecommendationCreate, db: Session = Depends(get_db)):
    db_rec = Recommendation(**rec.dict())
    db.add(db_rec)
    db.commit()
    db.refresh(db_rec)
    return db_rec

# Get all recommendations for a user
@app.get("/api/recommendations/{user_id}", response_model=list[RecommendationResponse])
def get_recommendations(user_id: int, db: Session = Depends(get_db)):
    recs = db.query(Recommendation).filter(Recommendation.user_id == user_id).all()
    return recs

# Update a recommendation's status
@app.put("/api/recommendations/{rec_id}", response_model=RecommendationResponse)
def update_recommendation(rec_id: int, rec_update: RecommendationUpdate, db: Session = Depends(get_db)):
    rec = db.query(Recommendation).filter(Recommendation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    rec.status = rec_update.status
    db.commit()
    db.refresh(rec)
    return rec


@app.get("/api/analysis/{user_id}", response_model=AnalysisResponse)
def get_analysis(user_id: int, db: Session = Depends(get_db)):
    # Retrieve the questionnaire response for the given user_id
    questionnaire = db.query(Questionnaire).filter(Questionnaire.user_id == user_id).first()
    if not questionnaire:
        raise HTTPException(status_code=404, detail="Questionnaire not found")
    
    # Create a basic summary
    summary = (
        f"Based on your goal of '{questionnaire.investment_goal}', "
        f"your savings habit is '{questionnaire.savings_habit}', "
        f"and your risk tolerance is '{questionnaire.risk_tolerance}'."
    )
    
    # Compute a simple risk score and recommendation based on risk tolerance
    risk_tolerance = questionnaire.risk_tolerance.lower()
    if risk_tolerance == "high":
        risk_score = 80
        investment_recommendation = "We recommend an aggressive strategy focused on high-growth equities."
    elif risk_tolerance == "medium":
        risk_score = 50
        investment_recommendation = "A balanced portfolio with a mix of equities and bonds is suitable for you."
    else:
        risk_score = 20
        investment_recommendation = "A conservative strategy focusing on fixed income and blue-chip stocks is advised."

    # Append the recommendation to the summary
    full_summary = summary + " " + investment_recommendation

    return AnalysisResponse(
        user_id=user_id,
        summary=full_summary,
        risk_score=risk_score,
        investment_recommendation=investment_recommendation
    )