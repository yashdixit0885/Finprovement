// src/OnboardingForm.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AuthForms.css';

const OnboardingForm = () => {
const location = useLocation();
const navigate = useNavigate();
// Expecting questions passed via state; if not, you can fallback to a default message
const { questions } = location.state || { questions: "Default onboarding questions..." };
const [answers, setAnswers] = useState("");

const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare onboarding data; in a real app, you might include user id and detailed answers
    const payload = { user_id: 1, answers };
    try {
    const response = await fetch("http://127.0.0.1:8000/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (response.ok) {
        // Navigate to Analysis Dashboard (or store the analysis in context)
        navigate("/analysis");
    } else {
        alert("Error: " + data.detail);
    }
    } catch (error) {
    alert("Error: " + error.toString());
    }
};

return (
    <div className="auth-container">
    <h2>Onboarding Questions</h2>
    <p>{questions}</p>
    <form onSubmit={handleSubmit}>
        <textarea
        placeholder="Enter your answers here..."
        value={answers}
        onChange={(e) => setAnswers(e.target.value)}
        required
        rows="6"
        style={{ width: "100%" }}
        />
        <button type="submit">Submit Onboarding Data</button>
    </form>
    </div>
);
};

export default OnboardingForm;
