// src/NavBar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './NavBar.css';

const NavBar = () => {
const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
const navigate = useNavigate();

const handleLogout = () => {
    // Update the authentication state to false
    setIsAuthenticated(false);
    // Optionally, clear any stored authentication tokens here
    // Redirect the user to the home page after logging out
    navigate('/');
};

return (
    <nav className="navbar">
    <ul>
        <li><Link to="/">Home</Link></li>
        {isAuthenticated ? (
        <>
            <li><Link to="/onboarding">Onboarding</Link></li>
            <li><Link to="/analysis">Analysis</Link></li>
            <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
        </>
        ) : (
        <>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </>
        )}
    </ul>
    </nav>
);
};

export default NavBar;
