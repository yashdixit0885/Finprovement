# backend/main.py
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, or_, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from pydantic import BaseModel

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACEHUB_API_TOKEN")


# --- Database Setup ---
SQLALCHEMY_DATABASE_URL = "sqlite:///./users.db"  # SQLite for development
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Password Hashing Setup ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Database Models ---

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Questionnaire(Base):
    __tablename__ = "questionnaires"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)  # Ideally, ForeignKey("users.id")
    investment_goal = Column(String)
    savings_habit = Column(String)
    risk_tolerance = Column(String)

# Recommendation model (from previous vertical slices)
class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    description = Column(String)
    status = Column(String, default="pending")

# Create all tables
Base.metadata.create_all(bind=engine)

# --- Pydantic Models ---

# For User Registration/Login
class UserCreate(BaseModel):
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    class Config:
        orm_mode = True

# For Questionnaire (existing)
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

# For Recommendations (existing)
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
    status: str

# New Pydantic Model for User Profile (for AI Onboarding)
class UserProfile(BaseModel):
    full_name: str
    age: int
    sex: str
    tax_status: str
    state: str
    city: str

# Model for AI responses (can be used for analysis, financial plan, progress)
class AIResponse(BaseModel):
    response: str

# Model for Onboarding Data input to AI Analysis Agent
class OnboardingData(BaseModel):
    user_id: int
    answers: str  # This could be a JSON string or a plain text summary of answers

# --- FastAPI App Initialization ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency for DB session
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

# --- AI Agent Integration using LangChain and Hugging Face ---
from langchain.llms import HuggingFaceHub

llm = HuggingFaceHub(
    repo_id="Qwen/QwQ-32B",  # Change to your desired model
    model_kwargs={"temperature": 0.7},
    huggingfacehub_api_token=HUGGINGFACE_API_KEY  # Use the key loaded from .env
)


def generate_onboarding_questions(user_profile: str) -> str:
    prompt = (
        f"You are a financial advisor. Based on the following user profile: {user_profile}, "
        "generate a list of personalized onboarding questions for financial planning."
    )
    response = llm(prompt)
    return response

def generate_analysis_report(onboarding_data: str) -> str:
    prompt = (
        f"Given the following onboarding data for a financial planning client: {onboarding_data}, "
        "produce a detailed financial analysis report including recommendations."
    )
    response = llm(prompt)
    return response

def generate_financial_plan(analysis_data: str) -> str:
    prompt = (
        f"Based on the following financial analysis report: {analysis_data}, "
        "generate a comprehensive financial plan including budget, investment, retirement, and tax strategies."
    )
    response = llm(prompt)
    return response

def generate_progress_insights(progress_data: str) -> str:
    prompt = (
        f"Given the user's progress data: {progress_data}, "
        "provide insights and recommendations for improving progress towards their financial goals."
    )
    response = llm(prompt)
    return response

# --- API Endpoints ---

# Registration Endpoint
@app.post("/api/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(or_(User.email == user.email, User.username == user.username)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email or username already registered")
    hashed_password = get_password_hash(user.password)
    db_user = User(email=user.email, username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Login Endpoint
@app.post("/api/login", response_model=UserResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    return db_user

# Questionnaire Endpoints (existing)
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

# Recommendations Endpoints (existing)
@app.post("/api/recommendations", response_model=RecommendationResponse)
def create_recommendation(rec: RecommendationCreate, db: Session = Depends(get_db)):
    db_rec = Recommendation(**rec.dict())
    db.add(db_rec)
    db.commit()
    db.refresh(db_rec)
    return db_rec

@app.get("/api/recommendations/{user_id}", response_model=list[RecommendationResponse])
def get_recommendations(user_id: int, db: Session = Depends(get_db)):
    recs = db.query(Recommendation).filter(Recommendation.user_id == user_id).all()
    return recs

@app.put("/api/recommendations/{rec_id}", response_model=RecommendationResponse)
def update_recommendation(rec_id: int, rec_update: RecommendationUpdate, db: Session = Depends(get_db)):
    rec = db.query(Recommendation).filter(Recommendation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    rec.status = rec_update.status
    db.commit()
    db.refresh(rec)
    return rec

# --- New AI Agent Endpoints ---

# 1. AI Onboarding Agent Endpoint: Generate personalized onboarding questions
@app.post("/api/ai-onboarding", response_model=AIResponse)
def ai_onboarding(profile: UserProfile):
    profile_str = f"{profile.full_name}, {profile.age} years old, {profile.sex}, tax status: {profile.tax_status}, located in {profile.city}, {profile.state}"
    try:
        questions = generate_onboarding_questions(profile_str)
        return AIResponse(response=questions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 2. AI Analysis Agent Endpoint: Generate analysis report from onboarding data
@app.post("/api/ai-analysis", response_model=AIResponse)
def ai_analysis(onboarding: OnboardingData):
    try:
        analysis = generate_analysis_report(onboarding.answers)
        return AIResponse(response=analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 3. AI Financial Plan Agent Endpoint: Generate personalized financial plan from analysis
@app.post("/api/ai-financial-plan", response_model=AIResponse)
def ai_financial_plan(analysis: AIResponse):
    try:
        plan = generate_financial_plan(analysis.response)
        return AIResponse(response=plan)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. AI Progress Tracker Agent Endpoint: Generate insights from progress data
@app.post("/api/ai-progress", response_model=AIResponse)
def ai_progress(progress: AIResponse):
    try:
        insights = generate_progress_insights(progress.response)
        return AIResponse(response=insights)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
