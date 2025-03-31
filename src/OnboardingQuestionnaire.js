// src/OnboardingQuestionnaire.js
import React, { useState } from 'react';
import './AuthForms.css'; // Optionally, you can reuse our common CSS for consistent styling

const OnboardingQuestionnaire = () => {
const [investmentGoal, setInvestmentGoal] = useState("");
const [savingsHabit, setSavingsHabit] = useState("");
const [riskTolerance, setRiskTolerance] = useState("");
const [message, setMessage] = useState("");

// For testing purposes, we use a fixed user_id. In a real application, this should come from the authenticated user.
const userId = 1;

const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
    user_id: userId,
    investment_goal: investmentGoal,
    savings_habit: savingsHabit,
    risk_tolerance: riskTolerance,
    };

    try {
    const response = await fetch("http://127.0.0.1:8000/api/questionnaire", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (response.ok) {
        setMessage("Questionnaire submitted successfully!");
    } else {
        setMessage("Error: " + data.detail);
    }
    } catch (error) {
    setMessage("Error: " + error.toString());
    }
};

return (
    <div className="auth-container">
    <h2>Onboarding Questionnaire</h2>
    <form onSubmit={handleSubmit}>
        <label>
        Investment Goal:
        <input
            type="text"
            value={investmentGoal}
            onChange={(e) => setInvestmentGoal(e.target.value)}
            placeholder="E.g., Retirement, Wealth Growth"
            required
        />
        </label>
        <br />
        <label>
        Savings Habit:
        <input
            type="text"
            value={savingsHabit}
            onChange={(e) => setSavingsHabit(e.target.value)}
            placeholder="E.g., Consistent, Irregular"
            required
        />
        </label>
        <br />
        <label>
        Risk Tolerance:
        <input
            type="text"
            value={riskTolerance}
            onChange={(e) => setRiskTolerance(e.target.value)}
            placeholder="E.g., High, Medium, Low"
            required
        />
        </label>
        <br />
        <button type="submit">Submit Questionnaire</button>
    </form>
    {message && <p>{message}</p>}
    </div>
);
};

export default OnboardingQuestionnaire;
