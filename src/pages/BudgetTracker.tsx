
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useBudgetTracker } from "@/hooks/useBudgetTracker";
import BudgetLimit from "@/components/budget-tracker/BudgetLimit";
import SummaryCards from "@/components/budget-tracker/SummaryCards";
import TransactionForm from "@/components/budget-tracker/TransactionForm";
import CategoryBreakdown from "@/components/budget-tracker/CategoryBreakdown";
import TransactionList from "@/components/budget-tracker/TransactionList";
import { Button } from "@/components/ui/button";

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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Budget Tracker</h2>
          <div className="flex gap-3">
            <Link to="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Link to="/budget-summary">
              <Button variant="outline">Budget Summary</Button>
            </Link>
          </div>
        </div>

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
