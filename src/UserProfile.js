// src/UserProfile.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForms.css';
import loadingGif from './images/loading.gif'; // Import the GIF from your assets folder


const UserProfile = () => {
const [fullName, setFullName] = useState("");
const [age, setAge] = useState("");
const [sex, setSex] = useState("");
const [taxStatus, setTaxStatus] = useState("");
const [state, setState] = useState("");
const [city, setCity] = useState("");
const [message, setMessage] = useState("");
const [isLoading, setIsLoading] = useState(false);
const navigate = useNavigate();

// Helper function to parse questions from AI output.
// Assumes the output is numbered like "1. Question one ... 2. Question two ..."
const parseQuestions = (text) => {
    const questions = text.split(/\d+\.\s+/).filter(q => q.trim() !== "");
    return questions;
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
    full_name: fullName,
    age: parseInt(age),
    sex,
    tax_status: taxStatus,
    state,
    city
    };
    try {
    const response = await fetch("http://127.0.0.1:8000/api/ai-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (response.ok) {
        const parsedQuestions = parseQuestions(data.response);
        setIsLoading(false);
        // Navigate to the OnboardingForm page with parsed questions in state.
        navigate("/onboarding", { state: { questions: parsedQuestions } });
    } else {
        setMessage("Error: " + data.detail);
        setIsLoading(false);
    }
    } catch (error) {
    setMessage("Error: " + error.toString());
    setIsLoading(false);
    }
};

return (
    <div className="auth-container">
    <h2>User Profile</h2>
    <form onSubmit={handleSubmit}>
        <input 
        type="text" 
        placeholder="Full Name" 
        value={fullName} 
        onChange={(e) => setFullName(e.target.value)} 
        required 
        />
        <input 
        type="number" 
        placeholder="Age" 
        value={age} 
        onChange={(e) => setAge(e.target.value)} 
        required 
        />
        <input 
        type="text" 
        placeholder="Sex" 
        value={sex} 
        onChange={(e) => setSex(e.target.value)} 
        required 
        />
        <input 
        type="text" 
        placeholder="Tax Status" 
        value={taxStatus} 
        onChange={(e) => setTaxStatus(e.target.value)} 
        required 
        />
        <input 
        type="text" 
        placeholder="State" 
        value={state} 
        onChange={(e) => setState(e.target.value)} 
        required 
        />
        <input 
        type="text" 
        placeholder="City" 
        value={city} 
        onChange={(e) => setCity(e.target.value)} 
        required 
        />
        <button type="submit">Submit Profile</button>
    </form>
    {isLoading && (
        <div className="loading-container">
        <p>Generating your personalized onboarding questions...</p>
        <img
            src={loadingGif}
            alt="Loading"
            style={{ 
                animation: 'none',
                transform: 'none',
                width: '50px', /* Adjust as needed */
                height: 'auto'
            }} 
            />
        </div>
    )}
    {message && <p>{message}</p>}
    </div>
);
};

export default UserProfile;
