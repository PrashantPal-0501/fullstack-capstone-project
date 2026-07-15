import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="hero-wrapper">
      <div className="hero-blob" />
      <div className="hero-content">
        <p className="hero-brand">GiftLink</p>
        <h1 className="hero-title">Share Gifts and Joy!</h1>
        <p className="hero-quote">
          "Sharing is the essence of community. It is through giving that we enrich and
          perpetuate both our lives and the lives of others."
        </p>
        <button className="hero-cta" onClick={() => navigate('/app/gifts')}>
          Get Started
        </button>
      </div>
    </div>
  );
}

export default HomePage;
