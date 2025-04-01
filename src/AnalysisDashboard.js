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
const userId = 1; // For testing; in a real app, derive from auth context

useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/analysis/${userId}`)
    .then((response) => {
        if (!response.ok) {
        // If status is 404, it might be that the questionnaire hasn't been completed yet.
        if (response.status === 404) {
            throw new Error("Questionnaire not found");
        }
        throw new Error("Error fetching analysis");
        }
        return response.json();
    })
    .then((data) => {
        setAnalysis(data);
        setLoading(false);
    })
    .catch((err) => {
        setError(err.message);
        setLoading(false);
    });
}, [userId]);

if (loading) {
    return <p>Loading analysis...</p>;
}

if (error) {
    if (error.includes("Questionnaire not found")) {
    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
        <h2>No Analysis Available</h2>
        <p>
            It looks like you haven't completed your onboarding questionnaire yet.
        </p>
        <p>
            Please <Link to="/onboarding">complete your onboarding</Link> to get your personalized financial analysis.
        </p>
        </div>
    );
    } else {
    return <p>Error: {error}</p>;
    }
}

// Prepare chart data using the risk score from analysis
const chartData = {
    labels: ['Risk Score'],
    datasets: [
    {
        label: 'Risk Score',
        data: [analysis.risk_score],
        backgroundColor: 'rgba(52, 152, 219, 0.5)',
    },
    ],
};

const chartOptions = {
    responsive: true,
    plugins: {
    legend: {
        position: 'top',
    },
    title: {
        display: true,
        text: 'Your Risk Score',
    },
    },
};

return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
    <h2>Your Financial Analysis</h2>
    <p>{analysis.summary}</p>
    <p>
        <strong>Investment Recommendation:</strong> {analysis.investment_recommendation}
    </p>
    <div style={{ marginTop: '40px' }}>
        <Bar data={chartData} options={chartOptions} />
    </div>
    </div>
);
};

export default AnalysisDashboard;
