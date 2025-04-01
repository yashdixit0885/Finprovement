// src/ProgressTracker.js
import React, { useState, useEffect } from 'react';
import './ProgressTracker.css';

const ProgressTracker = () => {
const [insights, setInsights] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const userId = 1; // For testing; replace with authenticated user ID

useEffect(() => {
    // Simulate progress data (e.g., a JSON summary of user's recommendation progress)
    const progressData = { response: "User's progress data summary" };
    fetch("http://127.0.0.1:8000/api/ai-progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(progressData)
    })
    .then(response => {
        if (!response.ok) {
        throw new Error("Error fetching AI progress insights");
        }
        return response.json();
    })
    .then(data => {
        setInsights(data.response);
        setLoading(false);
    })
    .catch(err => {
        setError(err.message);
        setLoading(false);
    });
}, [userId]);

if (loading) return <p>Loading progress insights...</p>;
if (error) return <p>Error: {error}</p>;

return (
    <div className="progress-tracker-container">
    <h2>Your Progress Insights (AI-Generated)</h2>
    <p>{insights}</p>
    </div>
);
};

export default ProgressTracker;
