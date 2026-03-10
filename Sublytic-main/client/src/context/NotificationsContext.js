// src/context/NotificationsContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext'; // Assume AuthContext provides the user

const socket = io('http://localhost:5000'); // Replace with your backend URL

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      // Step 1: Connect to the Socket.IO server and register the user
      socket.connect();
      socket.emit('registerUser', user.username);
      
      // Step 2: Listen for incoming notifications from the server
      socket.on('notification', (message) => {
        setNotifications((prevNotifications) => {
          const newNotification = {
            id: Date.now(),
            message: message,
            timestamp: new Date().toISOString(),
            read: false,
          };
          return [newNotification, ...prevNotifications];
        });
        setUnreadCount((prevCount) => prevCount + 1);
      });
      
    } else if (!user && socket.connected) {
      // Disconnect when user logs out
      socket.disconnect();
      setNotifications([]);
      setUnreadCount(0);
    }

    // Clean up on unmount to avoid memory leaks
    return () => {
      socket.off('notification');
      socket.disconnect();
    };
  }, [user]);

  const value = {
    notifications,
    unreadCount,
    setUnreadCount
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};