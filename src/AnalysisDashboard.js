// src/AnalysisDashboard.js
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalysisDashboard = () => {
const [analysis, setAnalysis] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const userId = 1; // For testing; replace with authenticated user id

useEffect(() => {
    // For this example, assume onboarding data has been submitted and AI analysis is ready
    // You might instead call the static endpoint or use context
    fetch(`http://127.0.0.1:8000/api/ai-analysis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, answers: "User's onboarding answers" })
    })
    .then((response) => {
        if (!response.ok) {
        throw new Error("Error fetching AI analysis");
        }
        return response.json();
    })
    .then((data) => {
        setAnalysis(data.response);
        setLoading(false);
    })
    .catch((err) => {
        setError(err.message);
        setLoading(false);
    });
}, [userId]);

if (loading) {
    return <p>Loading AI analysis...</p>;
}
if (error) {
    return <p>Error: {error}</p>;
}

// (For charting, you could extract a risk score from the response if your AI agent returns it)
const chartData = {
    labels: ['Risk Score'],
    datasets: [
    {
        label: 'Risk Score',
        data: [50], // Placeholder, adjust if AI returns a numeric value
        backgroundColor: 'rgba(52, 152, 219, 0.5)',
    },
    ],
};

const chartOptions = {
    responsive: true,
    plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Your Risk Score' },
    },
};

return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
    <h2>Your AI-Generated Financial Analysis</h2>
    <p>{analysis}</p>
    <div style={{ marginTop: '40px' }}>
        <Bar data={chartData} options={chartOptions} />
    </div>
    <p>If you would like to refine your plan, please <Link to="/onboarding">update your onboarding data</Link>.</p>
    </div>
);
};

export default AnalysisDashboard;
