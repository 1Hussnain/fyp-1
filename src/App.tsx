
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SimpleAuthProvider } from "@/contexts/SimpleAuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import AppLayout from "@/components/layout/AppLayout";
import OptimizedErrorBoundary from "@/components/ui/OptimizedErrorBoundary";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import OptimizedFinancialManagement from "./pages/OptimizedFinancialManagement";
import OptimizedGoalsTracker from "./pages/OptimizedGoalsTracker";
import BudgetSummary from "./pages/BudgetSummary";
import FinanceChat from "./pages/FinanceChat";
import DocumentViewer from "./pages/DocumentViewer";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <OptimizedErrorBoundary title="Application Error">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <SimpleAuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  
                  {/* Protected routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <OptimizedErrorBoundary title="Dashboard Error">
                          <Dashboard />
                        </OptimizedErrorBoundary>
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/transactions" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <OptimizedErrorBoundary title="Transactions Error">
                          <OptimizedFinancialManagement />
                        </OptimizedErrorBoundary>
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/goals" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <OptimizedErrorBoundary title="Goals Error">
                          <OptimizedGoalsTracker />
                        </OptimizedErrorBoundary>
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/budget" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <OptimizedErrorBoundary title="Budget Error">
                          <BudgetSummary />
                        </OptimizedErrorBoundary>
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/chat" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <OptimizedErrorBoundary title="Chat Error">
                          <FinanceChat />
                        </OptimizedErrorBoundary>
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/documents" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <OptimizedErrorBoundary title="Documents Error">
                          <DocumentViewer />
                        </OptimizedErrorBoundary>
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <OptimizedErrorBoundary title="Settings Error">
                          <Settings />
                        </OptimizedErrorBoundary>
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin routes */}
                  <Route path="/admin/dashboard" element={
                    <AdminRoute>
                      <AppLayout>
                        <OptimizedErrorBoundary title="Admin Dashboard Error">
                          <AdminDashboard />
                        </OptimizedErrorBoundary>
                      </AppLayout>
                    </AdminRoute>
                  } />
                  
                  <Route path="/admin/users" element={
                    <AdminRoute>
                      <AppLayout>
                        <OptimizedErrorBoundary title="User Management Error">
                          <UserManagement />
                        </OptimizedErrorBoundary>
                      </AppLayout>
                    </AdminRoute>
                  } />
                  
                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </SimpleAuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </OptimizedErrorBoundary>
  );
}

export default App;
