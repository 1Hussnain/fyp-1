
import React from "react";
import { motion } from "framer-motion";
import { useBudgetTracker } from "@/hooks/useBudgetTracker";
import BudgetLimit from "@/components/budget-tracker/BudgetLimit";
import SummaryCards from "@/components/budget-tracker/SummaryCards";
import TransactionForm from "@/components/budget-tracker/TransactionForm";
import CategoryBreakdown from "@/components/budget-tracker/CategoryBreakdown";
import TransactionList from "@/components/budget-tracker/TransactionList";

const BudgetTracker = () => {
  const {
    transactions,
    income,
    expenses,
    budgetLimit,
    remaining,
    overBudget,
    closeToLimit,
    categoryTotalsArray,
    handleBudgetLimitChange,
    handleAddTransaction
  } = useBudgetTracker();

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Budget Tracker</h2>

        {/* Budget Limit Setting */}
        <BudgetLimit 
          budgetLimit={budgetLimit}
          onBudgetLimitChange={handleBudgetLimitChange}
        />

        {/* Summary Cards */}
        <SummaryCards
          income={income}
          expenses={expenses}
          remaining={remaining}
          overBudget={overBudget}
          closeToLimit={closeToLimit}
        />

        {/* Entry Form */}
        <TransactionForm onAddTransaction={handleAddTransaction} />

        {/* Category Breakdown */}
        <CategoryBreakdown 
          categoryTotalsArray={categoryTotalsArray}
          expenses={expenses}
        />

        {/* Transaction List */}
        <TransactionList transactions={transactions} />
      </motion.div>
    </div>
  );
};

export default BudgetTracker;
