// src/OnboardingForm.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AuthForms.css';

const OnboardingForm = () => {
const location = useLocation();
const navigate = useNavigate();
// Expecting the parsed questions passed via state
const { questions } = location.state || { questions: [] };

// State to hold answers for each question, keyed by index
const [answers, setAnswers] = useState({});
const [message, setMessage] = useState("");

const handleChange = (index, value) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    const consolidatedAnswers = Object.values(answers).join(" ");
    const payload = { user_id: 1, answers: consolidatedAnswers }; // Update user_id as needed
    try {
    const response = await fetch("http://127.0.0.1:8000/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (response.ok) {
        navigate("/analysis");
    } else {
        setMessage("Error: " + data.detail);
    }
    } catch (error) {
    setMessage("Error: " + error.toString());
    }
};

return (
    <div className="auth-container">
    <h2>Answer the Following Questions</h2>
    <form onSubmit={handleSubmit}>
        {questions.length > 0 ? (
        questions.map((question, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
            <label>{question}</label>
            <textarea
                rows="2"
                style={{ width: "100%" }}
                onChange={(e) => handleChange(index, e.target.value)}
                required
            />
            </div>
        ))
        ) : (
        <p>No onboarding questions received.</p>
        )}
        <button type="submit">Submit Answers</button>
    </form>
    {message && <p>{message}</p>}
    </div>
);
};

export default OnboardingForm;
