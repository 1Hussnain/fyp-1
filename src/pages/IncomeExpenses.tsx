
import React from "react";
import { motion } from "framer-motion";
import { useTransactions } from "@/hooks/useTransactions";
import TransactionTabs from "@/components/income-expenses/TransactionTabs";
import TransactionHistory from "@/components/income-expenses/TransactionHistory";

const IncomeExpenses = () => {
  const {
    transactions,
    activeTab,
    setActiveTab,
    incomeForm,
    expenseForm,
    handleIncomeChange,
    handleExpenseChange,
    handleAddIncome,
    handleAddExpense
  } = useTransactions();

  return (
    <div className="p-6 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Income & Expenses</h2>
          
          <TransactionTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            incomeForm={incomeForm}
            expenseForm={expenseForm}
            handleIncomeChange={handleIncomeChange}
            handleExpenseChange={handleExpenseChange}
            handleAddIncome={handleAddIncome}
            handleAddExpense={handleAddExpense}
          />
          
          <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-800">Transaction History</h3>
          
          <TransactionHistory transactions={transactions} />
        </motion.div>
      </div>
    </div>
  );
};

export default IncomeExpenses;
