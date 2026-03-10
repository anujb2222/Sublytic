import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <h1>Welcome to Sublytic</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginTop: '2rem' }}>
        <button style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', background: '#2a7ae2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={() => navigate('/login')}>Login</button>
        <button style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', background: '#fff', color: '#2a7ae2', border: '2px solid #2a7ae2', borderRadius: '6px', cursor: 'pointer' }} onClick={() => navigate('/register')}>Register</button>
      </div>
    </div>
  );
}

export default LandingPage;
