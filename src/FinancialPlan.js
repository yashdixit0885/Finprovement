// src/FinancialPlan.js
import React, { useState, useEffect } from 'react';
import './FinancialPlan.css';

const FinancialPlan = () => {
const [plan, setPlan] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const userId = 1; // For testing; in production, get this from the auth context

useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/financial-plan/${userId}`)
    .then(response => {
        if (!response.ok) {
        throw new Error("Error fetching financial plan");
        }
        return response.json();
    })
    .then(data => {
        setPlan(data);
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
    <h2>Your Personalized Financial Plan</h2>
    <section>
        <h3>Budget Plan</h3>
        <p>{plan.budget_plan}</p>
    </section>
    <section>
        <h3>Investment Strategy</h3>
        <p>{plan.investment_strategy}</p>
    </section>
    <section>
        <h3>Retirement Plan</h3>
        <p>{plan.retirement_plan}</p>
    </section>
    <section>
        <h3>Tax Plan</h3>
        <p>{plan.tax_plan}</p>
    </section>
    </div>
);
};

export default FinancialPlan;
