
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import TransactionActions from "./TransactionActions";
import EditTransactionDialog from "./EditTransactionDialog";
import BulkTransactionActions from "./BulkTransactionActions";
import RecurringTransactionDialog from "./RecurringTransactionDialog";

interface Transaction {
  id: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  onEditTransaction?: (id: string, updates: Partial<Transaction>) => void;
  onDeleteTransaction?: (id: string) => void;
  onBulkImport?: (transactions: Omit<Transaction, 'id'>[]) => void;
  onAddRecurring?: (recurringTransaction: any) => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  transactions, 
  onEditTransaction,
  onDeleteTransaction,
  onBulkImport,
  onAddRecurring,
}) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleSaveEdit = (id: string, updates: Partial<Transaction>) => {
    if (onEditTransaction) {
      onEditTransaction(id, updates);
    }
    setEditingTransaction(null);
  };

  const handleDelete = (id: string) => {
    if (onDeleteTransaction) {
      onDeleteTransaction(id);
    }
  };

  const handleBulkImport = (importedTransactions: Omit<Transaction, 'id'>[]) => {
    if (onBulkImport) {
      onBulkImport(importedTransactions);
    }
  };

  const handleAddRecurring = (recurringTransaction: any) => {
    if (onAddRecurring) {
      onAddRecurring(recurringTransaction);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow border">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-md font-semibold">Recent Transactions</h4>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{transactions.length} transactions</span>
          <div className="flex gap-2">
            <BulkTransactionActions 
              transactions={transactions}
              onBulkImport={handleBulkImport}
            />
            <RecurringTransactionDialog onSave={handleAddRecurring} />
          </div>
        </div>
      </div>
      
      <ScrollArea className="h-80">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No transactions found.</p>
            <p className="text-sm">Try adjusting your filters or add new transactions.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center p-3 rounded-lg border bg-gray-50 group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                  }`}>
                    {transaction.type === "income" ? (
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.category}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`text-sm font-semibold ${
                    transaction.type === "income" ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                  </div>
                  
                  {(onEditTransaction || onDeleteTransaction) && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <TransactionActions
                        transaction={transaction}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>

      <EditTransactionDialog
        transaction={editingTransaction}
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default TransactionHistory;
