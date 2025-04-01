// src/RegisterForm.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './AuthForms.css';

const RegisterForm = () => {
const { setIsAuthenticated } = useContext(AuthContext);
const [email, setEmail] = useState("");
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [message, setMessage] = useState("");
const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password })
    });
    const data = await response.json();
    if (response.ok) {
        setMessage("Registration successful! Welcome " + data.username);
        // Optionally, set authentication if you want to auto-login:
        // setIsAuthenticated(true);
        // Navigate to login page after 2 seconds
        setTimeout(() => {
        navigate("/login");
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
    <h2>Register</h2>
    <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Register</button>
    </form>
    {message && <p>{message}</p>}
    </div>
);
};

export default RegisterForm;
