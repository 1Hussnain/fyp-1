
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { TransactionWithCategory, Category } from "@/services/optimizedFinancialService";
import { motion } from "framer-motion";

interface OptimizedTransactionListProps {
  transactions: TransactionWithCategory[];
  categories: Category[];
  onUpdateTransaction: (id: string, updates: Partial<TransactionWithCategory>) => Promise<boolean>;
  onDeleteTransaction: (id: string) => Promise<boolean>;
  title?: string;
  showPagination?: boolean;
}

const OptimizedTransactionList: React.FC<OptimizedTransactionListProps> = ({
  transactions,
  categories,
  onUpdateTransaction,
  onDeleteTransaction,
  title = "Transactions",
  showPagination = false
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState<string | null>(null);
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  
  const paginatedTransactions = showPagination 
    ? transactions.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
    : transactions;

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    
    setLoading(id);
    await onDeleteTransaction(id);
    setLoading(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Badge variant="secondary">{transactions.length} total</Badge>
      </CardHeader>
      <CardContent>
        {paginatedTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No transactions found
          </div>
        ) : (
          <div className="space-y-2">
            {paginatedTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'income' 
                      ? 'bg-green-100 dark:bg-green-900/20' 
                      : 'bg-red-100 dark:bg-red-900/20'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      {transaction.category && (
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: transaction.category.color }}
                        />
                      )}
                      <span className="font-medium">
                        {transaction.category?.name || 'Uncategorized'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(transaction.date)}
                      {transaction.description && (
                        <span className="ml-2">• {transaction.description}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`font-semibold ${
                    transaction.type === 'income' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
                  </span>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      disabled={loading === transaction.id}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleDelete(transaction.id)}
                      disabled={loading === transaction.id}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {showPagination && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {currentPage + 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizedTransactionList;
