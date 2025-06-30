
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

const queryClient = new QueryClient();

function App() {
  return (
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
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/transactions" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <OptimizedFinancialManagement />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/goals" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <OptimizedGoalsTracker />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/budget" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <BudgetSummary />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/chat" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <FinanceChat />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/documents" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <DocumentViewer />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Settings />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                {/* Admin routes */}
                <Route path="/admin/dashboard" element={
                  <AdminRoute>
                    <AppLayout>
                      <AdminDashboard />
                    </AppLayout>
                  </AdminRoute>
                } />
                
                <Route path="/admin/users" element={
                  <AdminRoute>
                    <AppLayout>
                      <UserManagement />
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
  );
}

export default App;
