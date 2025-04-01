// src/LoginForm.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './AuthForms.css';

const LoginForm = () => {
const { setIsAuthenticated } = useContext(AuthContext);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [message, setMessage] = useState("");
const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok) {
        setMessage("Login successful! Welcome back, " + data.username);
        // Set the authenticated state to true
        setIsAuthenticated(true);
        // Navigate to the analysis/dashboard page after 2 seconds
        setTimeout(() => {
        navigate("/analysis");
        }, 2000);
    } else {
        setMessage("Error: " + data.detail);
    }
    } catch (error) {
    setMessage("Error: " + error.toString());
    }
};

return (
    <div className="auth-container">
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
    </form>
    {message && <p>{message}</p>}
    </div>
);
};

export default LoginForm;
