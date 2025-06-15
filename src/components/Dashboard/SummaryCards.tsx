
/**
 * Dashboard Summary Cards Component
 * 
 * Displays key financial metrics with:
 * - Error boundary integration
 * - Loading states and skeletons
 * - Responsive design
 * - Performance optimizations
 */

import React from "react";
import { motion } from "framer-motion";
import { Wallet, CreditCard, PiggyBank, Calendar } from "lucide-react";
import { useFinancialSummary } from "@/hooks/useFinancialSummary";
import { useBudget } from "@/hooks/useBudget";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ComponentErrorBoundary from "@/components/ui/ComponentErrorBoundary";

/** Animation variants for staggered card entrance */
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

/**
 * Individual summary card data structure
 */
interface SummaryCardData {
  title: string;
  amount: string;
  icon: React.ComponentType<any>;
  color: string;
}

/**
 * Loading skeleton for summary cards
 */
const SummaryCardsSkeleton: React.FC = () => (
  <motion.div 
    variants={container}
    initial="hidden"
    animate="show"
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
  >
    {[...Array(4)].map((_, index) => (
      <motion.div
        key={index}
        variants={cardVariants}
        className="bg-white p-4 rounded-xl shadow"
      >
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

/**
 * Error fallback component
 */
const SummaryCardsError: React.FC<{ error: string }> = ({ error }) => (
  <Alert variant="destructive" className="mb-4">
    <AlertDescription>
      Failed to load financial summary: {error}
    </AlertDescription>
  </Alert>
);

/**
 * Main summary cards component
 */
const SummaryCards: React.FC = () => {
  const { totalIncome, totalExpenses, netIncome, loading: summaryLoading, error: summaryError } = useFinancialSummary();
  const { budgetLimit, remaining, loading: budgetLoading, overBudget, error: budgetError } = useBudget();

  const loading = summaryLoading || budgetLoading;
  const error = summaryError || budgetError;

  // Show error state
  if (error) {
    return <SummaryCardsError error={error} />;
  }

  // Show loading state
  if (loading) {
    return <SummaryCardsSkeleton />;
  }

  // Prepare card data with safe number formatting
  const cards: SummaryCardData[] = [
    { 
      title: "Total Income", 
      amount: `$${(totalIncome || 0).toLocaleString()}`, 
      icon: Wallet, 
      color: "text-green-500" 
    },
    { 
      title: "Total Expenses", 
      amount: `$${(totalExpenses || 0).toLocaleString()}`, 
      icon: CreditCard, 
      color: "text-red-500" 
    },
    { 
      title: "Savings", 
      amount: `$${(netIncome || 0).toLocaleString()}`, 
      icon: PiggyBank, 
      color: (netIncome || 0) >= 0 ? "text-blue-500" : "text-red-500" 
    },
    { 
      title: "Budget Remaining", 
      amount: `$${(remaining || 0).toLocaleString()}`, 
      icon: Calendar, 
      color: (remaining || 0) < 0 ? "text-red-500" : "text-orange-500" 
    }
  ];

  return (
    <div className="space-y-4">
      {/* Budget warning alert */}
      {overBudget && (
        <Alert variant="destructive">
          <AlertDescription>
            ⚠️ You've exceeded your monthly budget by ${Math.abs(remaining || 0).toLocaleString()}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Summary cards grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-4 rounded-xl shadow transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-2 ${card.color} bg-opacity-10`}>
                <card.icon size={24} className={card.color} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-xl font-bold">{card.amount}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

/**
 * Wrapped component with error boundary
 */
const SummaryCardsWithErrorBoundary: React.FC = () => (
  <ComponentErrorBoundary 
    componentName="Summary Cards" 
    showRetry={true}
  >
    <SummaryCards />
  </ComponentErrorBoundary>
);

export default SummaryCardsWithErrorBoundary;
