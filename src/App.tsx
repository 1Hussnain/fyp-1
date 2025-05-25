
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import IncomeExpenses from "./pages/IncomeExpenses";
import FinanceChat from "./pages/FinanceChat";
import BudgetTracker from "./pages/BudgetTracker";
import GoalsTracker from "./pages/GoalsTracker";
import BudgetSummary from "./pages/BudgetSummary";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/income-expenses" element={
              <ProtectedRoute>
                <IncomeExpenses />
              </ProtectedRoute>
            } />
            <Route path="/finance-chat" element={
              <ProtectedRoute>
                <FinanceChat />
              </ProtectedRoute>
            } />
            <Route path="/budget-tracker" element={
              <ProtectedRoute>
                <BudgetTracker />
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
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
