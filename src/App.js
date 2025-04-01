// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import NavBar from './NavBar';
import LandingPage from './LandingPage';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import OnboardingQuestionnaire from './OnboardingQuestionnaire';
import AnalysisDashboard from './AnalysisDashboard';
import RecommendationsDashboard from './RecommendationsDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/onboarding" element={<OnboardingQuestionnaire />} />
          <Route path="/analysis" element={<AnalysisDashboard />} />
          <Route path="/recommendations" element={<RecommendationsDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
