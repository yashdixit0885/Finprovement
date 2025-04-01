// src/FinancialPlan.js
import React, { useState, useEffect } from 'react';
import './FinancialPlan.css';

const FinancialPlan = () => {
const [plan, setPlan] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const userId = 1; // For testing; replace with authenticated user ID

useEffect(() => {
    // Assume that you have stored analysis data; here we simulate calling the AI endpoint
    const analysisData = { response: "User's detailed AI analysis report" };
    fetch("http://127.0.0.1:8000/api/ai-financial-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(analysisData)
    })
    .then(response => {
        if (!response.ok) {
        throw new Error("Error fetching AI financial plan");
        }
        return response.json();
    })
    .then(data => {
        setPlan(data.response);
        setLoading(false);
    })
    .catch(err => {
        setError(err.message);
        setLoading(false);
    });
}, [userId]);

if (loading) return <p>Loading financial plan...</p>;
if (error) return <p>Error: {error}</p>;

return (
    <div className="financial-plan-container">
    <h2>Your Personalized Financial Plan (AI-Generated)</h2>
    <section>
        <p>{plan}</p>
    </section>
    </div>
);
};

export default FinancialPlan;
