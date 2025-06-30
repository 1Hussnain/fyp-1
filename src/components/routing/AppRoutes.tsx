
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import ProtectedPageWrapper from './ProtectedPageWrapper';

// Pages
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import EnhancedDashboard from '@/pages/EnhancedDashboard';
import GoalsTracker from '@/pages/GoalsTracker';
import OptimizedGoalsTracker from '@/pages/OptimizedGoalsTracker';
import FinancialManagement from '@/pages/FinancialManagement';
import OptimizedFinancialManagement from '@/pages/OptimizedFinancialManagement';
import BudgetSummary from '@/pages/BudgetSummary';
import Settings from '@/pages/Settings';
import DocumentViewer from '@/pages/DocumentViewer';
import FinanceChat from '@/pages/FinanceChat';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <ProtectedPageWrapper pageTitle="Dashboard">
              <Dashboard />
            </ProtectedPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/enhanced-dashboard" 
        element={
          <ProtectedRoute>
            <ProtectedPageWrapper pageTitle="Enhanced Dashboard">
              <EnhancedDashboard />
            </ProtectedPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/goals" 
        element={
          <ProtectedRoute>
            <ProtectedPageWrapper pageTitle="Financial Goals">
              <GoalsTracker />
            </ProtectedPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/goals-optimized" 
        element={
          <ProtectedRoute>
            <ProtectedPageWrapper pageTitle="Goals Tracker">
              <OptimizedGoalsTracker />
            </ProtectedPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/financial" 
        element={
          <ProtectedRoute>
            <ProtectedPageWrapper pageTitle="Financial Management">
              <FinancialManagement />
            </ProtectedPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/financial-optimized" 
        element={
          <ProtectedRoute>
            <ProtectedPageWrapper pageTitle="Financial Management">
              <OptimizedFinancialManagement />
            </ProtectedPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/budget" 
        element={
          <ProtectedRoute>
            <ProtectedPageWrapper pageTitle="Budget Summary">
              <BudgetSummary />
            </ProtectedPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/documents" 
        element={
          <ProtectedRoute>
            <ProtectedPageWrapper pageTitle="Document Viewer">
              <DocumentViewer />
            </ProtectedPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chat" 
        element={
          <ProtectedRoute>
            <ProtectedPageWrapper pageTitle="Finance Chat">
              <FinanceChat />
            </ProtectedPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <ProtectedPageWrapper pageTitle="Settings">
              <Settings />
            </ProtectedPageWrapper>
          </ProtectedRoute>
        } 
      />
      
      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <ProtectedPageWrapper pageTitle="Admin Dashboard" isAdmin={true}>
              <AdminDashboard />
            </ProtectedPageWrapper>
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <AdminRoute>
            <ProtectedPageWrapper pageTitle="User Management" isAdmin={true}>
              <UserManagement />
            </ProtectedPageWrapper>
          </AdminRoute>
        } 
      />
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
