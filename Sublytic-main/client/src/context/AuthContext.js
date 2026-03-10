import React, { createContext, useState, useEffect } from 'react';
import { Spin } from 'antd';
import { socket } from '../socket'; // Import the socket instance

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // State was missing

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setUser({ token, username });
      socket.connect();
      socket.emit('registerUser', username);
    }
    setLoading(false); // Set loading to false after checking
  }, []);

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('username', userData.username);
    setUser(userData);
    socket.connect();
    socket.emit('registerUser', userData.username);
  };

const logout = () => {    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
    socket.disconnect();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};