// src/LandingPage.js
import React from 'react';
import './LandingPage.css';
import { Link } from 'react-router-dom';
import heroBackground from './images/hero-background.jpg';
import analysisIcon from './images/analysis-icon.png';
import planIcon from './images/plan-icon.png';
import progressIcon from './images/progress-icon.png';

const LandingPage = () => {
return (
    <div className="landing-container">
    
    {/* Hero Section */}
    <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroBackground})` }}
    >
        <div className="hero-content">
        <h1>Finprovement AI</h1>
        <p>Transforming financial guidance with personalized insights and cutting-edge technology.</p>
        <Link to="/register">
            <button>Get Started</button>
        </Link>
        </div>
    </section>

    {/* Features Section */}
    <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
        <div className="feature-item">
            <img src={analysisIcon} alt="Analysis" />
            <h3>Personalized Analysis</h3>
            <p>Receive tailored financial analysis based on your unique situation.</p>
        </div>
        <div className="feature-item">
            <img src={planIcon} alt="Plan" />
            <h3>Customized Plans</h3>
            <p>We develop actionable financial plans to help you meet your goals.</p>
        </div>
        <div className="feature-item">
            <img src={progressIcon} alt="Progress" />
            <h3>Track Progress</h3>
            <p>Monitor your progress with an easy-to-use dashboard and actionable insights.</p>
        </div>
        </div>
    </section>

    {/* Testimonials Section */}
    <section className="testimonials-section">
        <h2>What Our Clients Say</h2>
        <div className="testimonials-grid">
        <div className="testimonial-item">
            <p>"This service completely changed my approach to personal finance. The insights are spot on!"</p>
            <h4>- Jamie L.</h4>
        </div>
        <div className="testimonial-item">
            <p>"I was skeptical at first, but the personalized advice truly helped me gain financial confidence."</p>
            <h4>- Alex P.</h4>
        </div>
        <div className="testimonial-item">
            <p>"A game changer! Affordable and smart financial guidance at my fingertips."</p>
            <h4>- Casey M.</h4>
        </div>
        </div>
    </section>

    {/* Call-to-Action Section */}

    <section className="cta-section">
        <h2>Ready to Transform Your Finances?</h2>
        <Link to="/register">
        <button>Sign Up Now</button>
        </Link>
    </section>

    {/* Footer Section */}
    <footer className="landing-footer">
        <p>© 2025 AI Financial Advisor. All Rights Reserved.</p>
        <p>Disclaimer: The advice provided is for educational purposes only.</p>
    </footer>
    
    </div>
);
};

export default LandingPage;
