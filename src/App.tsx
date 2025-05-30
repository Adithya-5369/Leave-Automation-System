// import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ResetPassword from './components/auth/ResetPassword';
import Dashboard from './components/dashboard/Dashboard';
import LeaveApplication from './components/leaves/LeaveApplication';
import LeaveStatus from './components/leaves/LeaveStatus';
import ApprovalDashboard from './components/approvals/ApprovalDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NotFound from './components/common/NotFound';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{duration: 3000,}}/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leave-application" element={<LeaveApplication />} />
          <Route path="leave-status" element={<LeaveStatus />} />
          <Route path="approvals" element={<ApprovalDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;