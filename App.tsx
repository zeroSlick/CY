
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserRole } from './types';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HeuristicsPage from './pages/HeuristicsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/dashboard/page';
import ThreatDetectionPage from './pages/ThreatDetectionPage';
import IncidentManagementPage from './pages/IncidentManagementPage';
import ForensicsCasePanel from './pages/ForensicsCasePanel';
import UserManagementPage from './pages/UserManagementPage';
import IntelligenceFeedPage from './pages/IntelligenceFeedPage';
import NetworkLogPage from './pages/NetworkLogPage';
import Layout from './components/layout/Layout';

const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles?: UserRole[];
}> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-slate-600 font-black uppercase text-[10px] tracking-[0.5em] animate-pulse">
        Initializing Secure Connection...
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/heuristics" element={<HeuristicsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          <Route path="/app" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="threats" element={<ThreatDetectionPage />} />
            <Route path="incidents" element={<IncidentManagementPage />} />
            <Route path="forensics" element={<ForensicsCasePanel />} />
            <Route path="intelligence" element={<IntelligenceFeedPage />} />
            <Route path="logs" element={<NetworkLogPage />} />
            <Route path="users" element={<UserManagementPage />} />
          </Route>

          <Route path="/unauthorized" element={
            <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-white text-center p-6">
              <h1 className="text-4xl font-black mb-2 uppercase tracking-tighter">Clearance Denied</h1>
              <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.3em] max-w-xs">
                Credentials invalid for this sector. 
              </p>
              <button onClick={() => window.history.back()} className="mt-10 px-10 py-4 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">
                Return to Station
              </button>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
