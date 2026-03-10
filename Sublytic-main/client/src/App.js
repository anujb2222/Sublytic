import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { AuthContext } from './context/AuthContext';
import AppSidebar from './components/AppSidebar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import InsightsPage from './pages/InsightsPage';
import CalendarPage from './pages/CalendarPage';
import WhatIfPage from './pages/WhatIfPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import { NotificationsProvider } from './context/NotificationsContext';
const { Content } = Layout;

// This is the main layout for logged-in users, containing the sidebar and content area
function AppLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppSidebar />
      <Layout>
        <Content style={{ padding: 24 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/what-if" element={<WhatIfPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* If any other path is visited, redirect to the homepage */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <NotificationsProvider>
        <Routes>
          {/* Public routes only accessible when logged out */}
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />

          {/* This is the gatekeeper for your main application */}
          <Route
            path="/*"
            element={user ? <AppLayout /> : <Navigate to="/login" />}
          />
        </Routes>
      </NotificationsProvider>
    </Router>
  );
}

export default App;