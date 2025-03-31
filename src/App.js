// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import OnboardingQuestionnaire from './OnboardingQuestionnaire';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/onboarding" element={<OnboardingQuestionnaire />} />
      </Routes>
    </Router>
  );
}

export default App;
