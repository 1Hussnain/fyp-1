
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import UpdatePassword from '@/pages/UpdatePassword';
import Dashboard from '@/pages/Dashboard';
import FinancialManagement from '@/pages/FinancialManagement';
import GoalsTracker from '@/pages/GoalsTracker';
import BudgetSummary from '@/pages/BudgetSummary';
import DocumentViewer from '@/pages/DocumentViewer';
import FinanceChat from '@/pages/FinanceChat';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              
              {/* Protected routes with layout */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout pageTitle="Dashboard">
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/financial-management"
                element={
                  <ProtectedRoute>
                    <AppLayout pageTitle="Financial Management">
                      <FinancialManagement />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/goals-tracker"
                element={
                  <ProtectedRoute>
                    <AppLayout pageTitle="Goals Tracker">
                      <GoalsTracker />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/budget-summary"
                element={
                  <ProtectedRoute>
                    <AppLayout pageTitle="Budget Summary">
                      <BudgetSummary />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/document-viewer"
                element={
                  <ProtectedRoute>
                    <AppLayout pageTitle="Document Viewer">
                      <DocumentViewer />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finance-chat"
                element={
                  <ProtectedRoute>
                    <AppLayout pageTitle="Finance Chat">
                      <FinanceChat />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AppLayout pageTitle="Settings">
                      <Settings />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
          <Sonner />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
