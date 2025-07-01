
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import ImprovedFinancialManagement from "@/pages/ImprovedFinancialManagement";
import ImprovedGoalsTracker from "@/pages/ImprovedGoalsTracker";
import BudgetSummary from "@/pages/BudgetSummary";
import DocumentViewer from "@/pages/DocumentViewer";
import FinanceChat from "@/pages/FinanceChat";
import Settings from "@/pages/Settings";
import ForgotPassword from "@/pages/ForgotPassword";
import UpdatePassword from "@/pages/UpdatePassword";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
              <div className="min-h-screen">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/update-password" element={<UpdatePassword />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/financial-management"
                    element={
                      <ProtectedRoute>
                        <ImprovedFinancialManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/goals-tracker"
                    element={
                      <ProtectedRoute>
                        <ImprovedGoalsTracker />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/budget-summary"
                    element={
                      <ProtectedRoute>
                        <BudgetSummary />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/document-viewer"
                    element={
                      <ProtectedRoute>
                        <DocumentViewer />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/finance-chat"
                    element={
                      <ProtectedRoute>
                        <FinanceChat />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
