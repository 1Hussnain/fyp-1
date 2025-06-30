
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AppLayout from "@/components/layout/AppLayout";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import EnhancedDashboard from "./pages/EnhancedDashboard";
import GoalsTracker from "./pages/GoalsTracker";
import OptimizedGoalsTracker from "./pages/OptimizedGoalsTracker";
import FinancialManagement from "./pages/FinancialManagement";
import OptimizedFinancialManagement from "./pages/OptimizedFinancialManagement";
import BudgetSummary from "./pages/BudgetSummary";
import Settings from "./pages/Settings";
import DocumentViewer from "./pages/DocumentViewer";
import FinanceChat from "./pages/FinanceChat";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Admin Route Component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Simple admin check - you might want to implement proper role checking
  const isAdmin = user.email?.includes('admin') || user.user_metadata?.role === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <AppLayout pageTitle="Dashboard">
                          <Dashboard />
                        </AppLayout>
                      </ErrorBoundary>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/enhanced-dashboard" 
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <AppLayout pageTitle="Enhanced Dashboard">
                          <EnhancedDashboard />
                        </AppLayout>
                      </ErrorBoundary>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/goals" 
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <AppLayout pageTitle="Financial Goals">
                          <GoalsTracker />
                        </AppLayout>
                      </ErrorBoundary>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/goals-optimized" 
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <AppLayout pageTitle="Goals Tracker">
                          <OptimizedGoalsTracker />
                        </AppLayout>
                      </ErrorBoundary>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/financial" 
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <AppLayout pageTitle="Financial Management">
                          <FinancialManagement />
                        </AppLayout>
                      </ErrorBoundary>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/financial-optimized" 
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <AppLayout pageTitle="Financial Management">
                          <OptimizedFinancialManagement />
                        </AppLayout>
                      </ErrorBoundary>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/budget" 
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <AppLayout pageTitle="Budget Summary">
                          <BudgetSummary />
                        </AppLayout>
                      </ErrorBoundary>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/documents" 
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <AppLayout pageTitle="Document Viewer">
                          <DocumentViewer />
                        </AppLayout>
                      </ErrorBoundary>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/chat" 
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <AppLayout pageTitle="Finance Chat">
                          <FinanceChat />
                        </AppLayout>
                      </ErrorBoundary>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <AppLayout pageTitle="Settings">
                          <Settings />
                        </AppLayout>
                      </ErrorBoundary>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <ErrorBoundary>
                        <AppLayout pageTitle="Admin Dashboard" isAdmin={true}>
                          <AdminDashboard />
                        </AppLayout>
                      </ErrorBoundary>
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <AdminRoute>
                      <ErrorBoundary>
                        <AppLayout pageTitle="User Management" isAdmin={true}>
                          <UserManagement />
                        </AppLayout>
                      </ErrorBoundary>
                    </AdminRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
