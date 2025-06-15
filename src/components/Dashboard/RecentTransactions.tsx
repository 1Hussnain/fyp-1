
/**
 * Recent Transactions Component
 * 
 * Displays the most recent financial transactions with real-time updates.
 * Features:
 * - Shows last 5 transactions sorted by creation date
 * - Real-time updates through useTransactions hook (no duplicate subscriptions)
 * - Color-coded transaction types (income/expense) with appropriate icons
 * - Formatted dates and amounts for better readability
 * - Responsive design with mobile-friendly layout
 * - Loading states and empty state handling
 * 
 * Note: Real-time updates are handled by useTransactions hook through
 * the centralized subscription manager, preventing duplicate subscriptions.
 */

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTransactions } from "@/hooks/useTransactions";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";

/**
 * Main RecentTransactions component
 * Uses useTransactions hook which provides centralized real-time updates
 */
const RecentTransactions = () => {
  // Get transactions data from centralized hook (includes real-time updates)
  const { transactions, loading } = useTransactions();

  /**
   * Get the 5 most recent transactions sorted by creation date
   * Uses created_at timestamp for accurate chronological ordering
   */
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  /**
   * Loading state component with skeleton placeholders
   * Provides visual feedback while data is being fetched
   */
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Generate 3 skeleton items for loading state */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="flex items-center gap-3">
                  {/* Skeleton for transaction icon */}
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div>
                    {/* Skeleton for transaction description */}
                    <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
                    {/* Skeleton for transaction date */}
                    <div className="w-16 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                {/* Skeleton for amount */}
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  /**
   * Empty state component when no transactions exist
   * Provides helpful guidance for new users
   */
  if (recentTransactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No transactions yet.</p>
            <p className="text-sm">Add your first transaction to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  /**
   * Main component render with transaction list
   * Each transaction item includes animation, icons, and formatted data
   */
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Recent Transactions</CardTitle>
        {/* More options icon for future functionality */}
        <MoreHorizontal className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }} // Staggered animation for visual appeal
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {/* Left side: Icon and transaction details */}
              <div className="flex items-center gap-3">
                {/* Transaction type icon with appropriate color coding */}
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 dark:bg-green-900/20' 
                    : 'bg-red-100 dark:bg-red-900/20'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                  )}
                </div>
                
                {/* Transaction description and metadata */}
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {transaction.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-2">
                    {/* Formatted date using date-fns for consistency */}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(transaction.date), 'MMM dd')}
                    </p>
                    {/* Category badge if available */}
                    {transaction.categories && (
                      <Badge variant="secondary" className="text-xs">
                        {transaction.categories.name}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right side: Amount with appropriate formatting and color */}
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {/* Add +/- prefix and format to 2 decimal places */}
                  {transaction.type === 'income' ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
