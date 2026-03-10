import React, { useState, useEffect } from 'react';

function NotificationBanner({ message, onClose }) {
  if (!message) return null;
  return (
    <div style={{
      background: '#ffe066',
      color: '#333',
      padding: '1rem',
      borderRadius: '6px',
      margin: '1rem 0',
      position: 'relative',
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
    }}>
      <span>{message}</span>
      <button onClick={onClose} style={{ position: 'absolute', right: 10, top: 10, background: 'none', border: 'none', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>×</button>
    </div>
  );
}

export default NotificationBanner;
