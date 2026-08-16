import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import ToastContainer from './components/ToastContainer';
import HomePage from './pages/HomePage';
import ExploreMapPage from './pages/ExploreMapPage';
import ReportIssuePage from './pages/ReportIssuePage';
import IssueDetailPage from './pages/IssueDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CitizenDashboard from './pages/CitizenDashboard';
import OfficerAnalytics from './pages/OfficerAnalytics';
import ContractorTasks from './pages/ContractorTasks';
import { initSocketClient, getSocket } from './services/socket';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('civicfix_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [toasts, setToasts] = useState([]);

  const addToast = (toastObj) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...toastObj, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  useEffect(() => {
    initSocketClient();
    const socket = getSocket();

    const handleCreated = (data) => {
      addToast({
        type: 'info',
        title: 'New Civic Report Registered',
        message: `${data.title} logged in system.`,
      });
    };

    const handleStatusUpdated = (data) => {
      addToast({
        type: data.newStatus === 'resolved' ? 'success' : 'warning',
        title: `Status Updated (${data.newStatus.toUpperCase()})`,
        message: `Work Order status updated.`,
      });
    };

    socket.on('issue:created', handleCreated);
    socket.on('issue:status_updated', handleStatusUpdated);

    return () => {
      socket.off('issue:created', handleCreated);
      socket.off('issue:status_updated', handleStatusUpdated);
    };
  }, []);

  const handleLoginSuccess = (userObj, token) => {
    setUser(userObj);
    localStorage.setItem('civicfix_user', JSON.stringify(userObj));
    localStorage.setItem('civicfix_token', token);
    addToast({
      type: 'success',
      title: 'Authenticated Successfully',
      message: `Logged in as ${userObj.full_name} (${userObj.role.toUpperCase()})`,
    });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('civicfix_user');
    localStorage.removeItem('civicfix_token');
    addToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been logged out of the portal.',
    });
    window.location.href = '/';
  };

  return (
    <Router>
      <MainLayout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<ExploreMapPage />} />
          <Route path="/explore" element={<ExploreMapPage />} />
          <Route path="/report" element={<ReportIssuePage />} />
          <Route path="/issues/:id" element={<IssueDetailPage />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<RegisterPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/citizen/dashboard" element={<CitizenDashboard user={user} />} />
          <Route path="/officer/analytics" element={<OfficerAnalytics user={user} />} />
          <Route path="/admin" element={<OfficerAnalytics user={user} />} />
          <Route path="/contractor/tasks" element={<ContractorTasks user={user} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>

      {/* Real-time Toast Stack */}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </Router>
  );
}
