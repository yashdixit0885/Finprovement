// src/RecommendationsDashboard.js
import React, { useState, useEffect } from 'react';
import './AuthForms.css';  // Reusing common styling

const RecommendationsDashboard = () => {
const [recommendations, setRecommendations] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const userId = 1;  // For testing; in a real app, derive from authentication context

// Fetch recommendations from the backend
const fetchRecommendations = () => {
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
};

useEffect(() => {
    fetchRecommendations();
}, [userId]);

// Function to update a recommendation's status
const updateStatus = (recId, newStatus) => {
    fetch(`http://127.0.0.1:8000/api/recommendations/${recId}`, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ status: newStatus })
    })
    .then((response) => {
        if (!response.ok) {
        throw new Error("Error updating recommendation");
        }
        return response.json();
    })
    .then((updatedRec) => {
        // Update local state with the new status
        setRecommendations((prevRecs) =>
        prevRecs.map((rec) =>
            rec.id === updatedRec.id ? updatedRec : rec
        )
        );
    })
    .catch((err) => {
        alert(err.message);
    });
};

if (loading) {
    return <p>Loading recommendations...</p>;
}

if (error) {
    return <p>Error: {error}</p>;
}

return (
    <div className="auth-container">
    <h2>Your Actionable Recommendations</h2>
    {recommendations.length === 0 ? (
        <p>No recommendations available at this time.</p>
    ) : (
        <ul>
        {recommendations.map((rec) => (
            <li key={rec.id} style={{ marginBottom: '10px', textAlign: 'left' }}>
            <p><strong>Description:</strong> {rec.description}</p>
            <p>
                <strong>Status:</strong> {rec.status}
                {" "}
                {rec.status !== "complete" && (
                <button
                    onClick={() => updateStatus(rec.id, "complete")}
                    style={{ marginLeft: '10px' }}
                >
                    Mark as Complete
                </button>
                )}
            </p>
            </li>
        ))}
        </ul>
    )}
    </div>
);
};

export default RecommendationsDashboard;
