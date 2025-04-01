// src/ProgressTracker.js
import React, { useState, useEffect } from 'react';
import './ProgressTracker.css'; // We'll create some styles for the progress tracker

const ProgressTracker = () => {
const [recommendations, setRecommendations] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const userId = 1; // For testing; in a real app, this should come from the authentication context

// Fetch recommendations from the backend
useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/recommendations/${userId}`)
    .then((response) => {
        if (!response.ok) {
        throw new Error("Error fetching recommendations");
        }
        return response.json();
    })
    .then((data) => {
        setRecommendations(data);
        setLoading(false);
    })
    .catch((err) => {
        setError(err.message);
        setLoading(false);
    });
}, [userId]);

// Calculate progress percentage: number of complete recommendations divided by total recommendations
const total = recommendations.length;
const completed = recommendations.filter(rec => rec.status === "complete").length;
const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

if (loading) {
    return <p>Loading progress...</p>;
}

if (error) {
    return <p>Error: {error}</p>;
}

return (
    <div className="progress-tracker-container">
    <h2>Your Progress</h2>
    {total === 0 ? (
        <p>No recommendations available. Complete some recommendations to track progress.</p>
    ) : (
        <>
        <p>{completed} out of {total} recommendations completed ({progressPercent}%).</p>
        <div className="progress-bar">
            <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
            ></div>
        </div>
        </>
    )}
    </div>
);
};

export default ProgressTracker;
