
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import GoalsTracker from '@/pages/GoalsTracker';
import BudgetSummary from '@/pages/BudgetSummary';
import FinanceChat from '@/pages/FinanceChat';
import DocumentViewer from '@/pages/DocumentViewer';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import FinancialManagement from '@/pages/FinancialManagement';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout pageTitle="Dashboard">
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/financial-management" element={
            <ProtectedRoute>
              <AppLayout pageTitle="Financial Management">
                <FinancialManagement />
              </AppLayout>
            </ProtectedRoute>
          } />
          {/* Redirect old routes to unified financial management */}
          <Route path="/budget-tracker" element={<Navigate to="/financial-management" replace />} />
          <Route path="/income-expenses" element={<Navigate to="/financial-management" replace />} />
          <Route path="/goals-tracker" element={
            <ProtectedRoute>
              <AppLayout pageTitle="Goals Tracker">
                <GoalsTracker />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/budget-summary" element={
            <ProtectedRoute>
              <AppLayout pageTitle="Budget Summary">
                <BudgetSummary />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/finance-chat" element={
            <ProtectedRoute>
              <AppLayout pageTitle="Finance Chat">
                <FinanceChat />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/document-viewer" element={
            <ProtectedRoute>
              <AppLayout pageTitle="Document Viewer">
                <DocumentViewer />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <AppLayout pageTitle="Settings">
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
