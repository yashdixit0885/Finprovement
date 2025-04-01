// src/UserProfile.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForms.css';

const UserProfile = () => {
const [fullName, setFullName] = useState("");
const [age, setAge] = useState("");
const [sex, setSex] = useState("");
const [taxStatus, setTaxStatus] = useState("");
const [state, setState] = useState("");
const [city, setCity] = useState("");
const [questions, setQuestions] = useState("");
const [message, setMessage] = useState("");
const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
    full_name: fullName,
    age: parseInt(age),
    sex,
    tax_status: taxStatus,
    state,
    city
    };
    try {
    const response = await fetch("http://127.0.0.1:8000/api/ai-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (response.ok) {
        setQuestions(data.response);
        // Optionally, navigate to an Onboarding page and pass questions in state
        // navigate("/onboarding", { state: { questions: data.response } });
    } else {
        setMessage("Error: " + data.detail);
    }
    } catch (error) {
    setMessage("Error: " + error.toString());
    }
};

return (
    <div className="auth-container">
    <h2>User Profile</h2>
    <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required />
        <input type="text" placeholder="Sex" value={sex} onChange={(e) => setSex(e.target.value)} required />
        <input type="text" placeholder="Tax Status" value={taxStatus} onChange={(e) => setTaxStatus(e.target.value)} required />
        <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required />
        <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
        <button type="submit">Submit Profile</button>
    </form>
    {message && <p>{message}</p>}
    {questions && (
        <div>
        <h3>Personalized Onboarding Questions:</h3>
        <p>{questions}</p>
        </div>
    )}
    </div>
);
};

export default UserProfile;
