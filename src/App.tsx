
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AppLayout from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import FinancialManagement from "./pages/FinancialManagement";
import GoalsTracker from "./pages/GoalsTracker";
import BudgetSummary from "./pages/BudgetSummary";
import FinanceChat from "./pages/FinanceChat";
import DocumentViewer from "./pages/DocumentViewer";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Regular app routes with AppLayout */}
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
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <AppLayout pageTitle="Financial Management">
                      <FinancialManagement />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/goals"
                element={
                  <ProtectedRoute>
                    <AppLayout pageTitle="Financial Goals">
                      <GoalsTracker />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/budget"
                element={
                  <ProtectedRoute>
                    <AppLayout pageTitle="Budget Summary">
                      <BudgetSummary />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <AppLayout pageTitle="Finance Chat">
                      <FinanceChat />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents"
                element={
                  <ProtectedRoute>
                    <AppLayout pageTitle="Documents">
                      <DocumentViewer />
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
              
              {/* Admin routes with AppLayout */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminRoute>
                      <AppLayout pageTitle="Admin Dashboard" isAdmin={true}>
                        <AdminDashboard />
                      </AppLayout>
                    </AdminRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <AdminRoute>
                      <AppLayout pageTitle="User Management" isAdmin={true}>
                        <UserManagement />
                      </AppLayout>
                    </AdminRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute>
                    <AdminRoute>
                      <AppLayout pageTitle="Analytics" isAdmin={true}>
                        <div>Analytics Page (Coming Soon)</div>
                      </AppLayout>
                    </AdminRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute>
                    <AdminRoute>
                      <AppLayout pageTitle="Admin Settings" isAdmin={true}>
                        <div>Admin Settings (Coming Soon)</div>
                      </AppLayout>
                    </AdminRoute>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
