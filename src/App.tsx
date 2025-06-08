
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import BudgetTracker from '@/pages/BudgetTracker';
import IncomeExpenses from '@/pages/IncomeExpenses';
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
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/financial-management" element={
            <ProtectedRoute>
              <FinancialManagement />
            </ProtectedRoute>
          } />
          <Route path="/budget-tracker" element={
            <ProtectedRoute>
              <BudgetTracker />
            </ProtectedRoute>
          } />
          <Route path="/income-expenses" element={
            <ProtectedRoute>
              <IncomeExpenses />
            </ProtectedRoute>
          } />
          <Route path="/goals-tracker" element={
            <ProtectedRoute>
              <GoalsTracker />
            </ProtectedRoute>
          } />
          <Route path="/budget-summary" element={
            <ProtectedRoute>
              <BudgetSummary />
            </ProtectedRoute>
          } />
          <Route path="/finance-chat" element={
            <ProtectedRoute>
              <FinanceChat />
            </ProtectedRoute>
          } />
          <Route path="/document-viewer" element={
            <ProtectedRoute>
              <DocumentViewer />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
