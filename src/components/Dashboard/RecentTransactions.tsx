
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTransactions } from "@/hooks/useTransactions";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { TransactionWithCategory } from "@/types/database";

/**
 * RecentTransactions Component
 * 
 * Displays the most recent financial transactions with real-time updates.
 * Features:
 * - Shows last 5 transactions
 * - Real-time updates via Supabase subscriptions
 * - Color-coded transaction types (income/expense)
 * - Formatted dates and amounts
 * - Responsive design
 */
const RecentTransactions = () => {
  const { transactions, loading, refetch } = useTransactions();
  const [realtimeTransactions, setRealtimeTransactions] = useState<TransactionWithCategory[]>([]);

  // Get recent transactions (last 5)
  const recentTransactions = (realtimeTransactions.length > 0 ? realtimeTransactions : transactions)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  useEffect(() => {
    // Initialize with current transactions
    setRealtimeTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    // Set up real-time subscription for transactions
    const channel = supabase
      .channel(`transactions-realtime-${Date.now()}`) // Unique channel name to avoid conflicts
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'transactions'
        },
        (payload) => {
          console.log('Real-time transaction update:', payload);
          
          // Refetch transactions to get updated data with category joins
          refetch();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    // Cleanup function to properly remove the channel
    return () => {
      console.log('Cleaning up transactions subscription');
      supabase.removeChannel(channel);
    };
  }, []); // Empty dependency array to ensure this only runs once

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Recent Transactions</CardTitle>
        <MoreHorizontal className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
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
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {transaction.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(transaction.date), 'MMM dd')}
                    </p>
                    {transaction.categories && (
                      <Badge variant="secondary" className="text-xs">
                        {transaction.categories.name}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
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
