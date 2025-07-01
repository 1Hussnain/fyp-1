
import React from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Filter } from "lucide-react";
import { TransactionWithCategory } from "@/types/database";

interface TransactionListProps {
  transactions: TransactionWithCategory[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Transaction History</h3>
        
        {/* TO-DO Placeholder for filtering functionality */}
        <div className="border border-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-md flex items-center gap-2 text-xs text-red-600 dark:text-red-400 cursor-pointer">
          <Filter size={16} />
          <span>Filter Transactions (Coming Soon)</span>
        </div>
      </div>
      
      {transactions.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 my-6">No transactions yet. Add your first one above!</p>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {transactions.map((transaction) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-sm"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {transaction.categories?.name || 'Uncategorized'}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(transaction.date)}
                  {transaction.description && (
                    <span className="ml-2">• {transaction.description}</span>
                  )}
                </div>
              </div>
              <div className={`flex items-center ${transaction.type === "expense" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                {transaction.type === "expense" ? (
                  <ArrowDown className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowUp className="h-3 w-3 mr-1" />
                )}
                ${Number(transaction.amount).toFixed(2)}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
