// src/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
// For simplicity, we initialize as false.
// In a real app, this could be derived from tokens or user data.
const [isAuthenticated, setIsAuthenticated] = useState(false);

return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
    {children}
    </AuthContext.Provider>
);
};
