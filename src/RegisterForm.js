// src/RegisterForm.js
import React, { useState } from 'react';

const RegisterForm = () => {
const [email, setEmail] = useState("");
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [message, setMessage] = useState("");

// Handle form submission
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, username, password })
    });
    const data = await response.json();
    if (response.ok) {
        setMessage("Registration successful! Welcome " + data.username);
    } else {
        setMessage("Error: " + data.detail);
    }
    } catch (error) {
    setMessage("Error: " + error.toString());
    }
};

return (
    <div>
    <h2>Register</h2>
    <form onSubmit={handleSubmit}>
        <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
        /><br/>
        <input 
        type="text" 
        placeholder="Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        required 
        /><br/>
        <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
        /><br/>
        <button type="submit">Register</button>
    </form>
    {message && <p>{message}</p>}
    </div>
);
};

export default RegisterForm;
