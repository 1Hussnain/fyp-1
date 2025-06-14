import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ErrorBoundary from '@/components/ErrorBoundary';
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
import OptimizedFinancialManagement from '@/pages/OptimizedFinancialManagement';
import OptimizedGoalsTracker from '@/pages/OptimizedGoalsTracker';

function App() {
  return (
    <ErrorBoundary showDetails={import.meta.env.DEV}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<AppLayout><Index /></AppLayout>} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <AppLayout pageTitle="Dashboard">
                    <ErrorBoundary fallback={
                      <div className="p-8 text-center">
                        <p>Unable to load dashboard. Please refresh the page.</p>
                      </div>
                    }>
                      <Dashboard />
                    </ErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/financial-management" element={
                <ProtectedRoute>
                  <AppLayout pageTitle="Financial Management">
                    <ErrorBoundary fallback={
                      <div className="p-8 text-center">
                        <p>Unable to load financial management. Please refresh the page.</p>
                      </div>
                    }>
                      <OptimizedFinancialManagement />
                    </ErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/budget-tracker" element={<Navigate to="/financial-management" replace />} />
              <Route path="/income-expenses" element={<Navigate to="/financial-management" replace />} />
              <Route path="/goals-tracker" element={
                <ProtectedRoute>
                  <AppLayout pageTitle="Goals Tracker">
                    <ErrorBoundary fallback={
                      <div className="p-8 text-center">
                        <p>Unable to load goals tracker. Please refresh the page.</p>
                      </div>
                    }>
                      <OptimizedGoalsTracker />
                    </ErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/budget-summary" element={
                <ProtectedRoute>
                  <AppLayout pageTitle="Budget Summary">
                    <ErrorBoundary fallback={
                      <div className="p-8 text-center">
                        <p>Unable to load budget summary. Please refresh the page.</p>
                      </div>
                    }>
                      <BudgetSummary />
                    </ErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/finance-chat" element={
                <ProtectedRoute>
                  <AppLayout pageTitle="Finance Chat">
                    <ErrorBoundary fallback={
                      <div className="p-8 text-center">
                        <p>Unable to load finance chat. Please refresh the page.</p>
                      </div>
                    }>
                      <FinanceChat />
                    </ErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/document-viewer" element={
                <ProtectedRoute>
                  <AppLayout pageTitle="Document Viewer">
                    <ErrorBoundary fallback={
                      <div className="p-8 text-center">
                        <p>Unable to load document viewer. Please refresh the page.</p>
                      </div>
                    }>
                      <DocumentViewer />
                    </ErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <AppLayout pageTitle="Settings">
                    <ErrorBoundary fallback={
                      <div className="p-8 text-center">
                        <p>Unable to load settings. Please refresh the page.</p>
                      </div>
                    }>
                      <Settings />
                    </ErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
            </Routes>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
