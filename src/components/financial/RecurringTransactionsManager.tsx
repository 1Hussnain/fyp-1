
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Play, Pause, Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useRecurringTransactions } from "@/hooks/useRecurringTransactions";
import RecurringTransactionDialog from "./RecurringTransactionDialog";

const RecurringTransactionsManager = () => {
  const {
    recurringTransactions,
    toggleRecurringTransaction,
    deleteRecurringTransaction,
    processRecurringTransactions
  } = useRecurringTransactions();

  const [showDialog, setShowDialog] = useState(false);

  const handleProcessAll = async () => {
    await processRecurringTransactions();
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'weekly':
        return 'bg-blue-100 text-blue-800';
      case 'monthly':
        return 'bg-green-100 text-green-800';
      case 'yearly':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recurring Transactions
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleProcessAll}
              disabled={recurringTransactions.filter(t => t.active).length === 0}
            >
              <Play className="mr-2 h-4 w-4" />
              Process Due
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDialog(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Recurring
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {recurringTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No recurring transactions set up</p>
            <p className="text-sm mt-1">Add recurring income or expenses to automate your finances</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recurringTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${
                  transaction.active ? 'bg-white' : 'bg-gray-50 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{transaction.category}</h4>
                      <Badge
                        variant={transaction.type === 'income' ? 'default' : 'secondary'}
                      >
                        {transaction.type}
                      </Badge>
                      <Badge
                        className={getFrequencyColor(transaction.frequency)}
                        variant="outline"
                      >
                        {transaction.frequency}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </span>
                      <span>Since: {new Date(transaction.startDate).toLocaleDateString()}</span>
                      {transaction.endDate && (
                        <span>Until: {new Date(transaction.endDate).toLocaleDateString()}</span>
                      )}
                      {transaction.lastProcessed && (
                        <span>Last: {new Date(transaction.lastProcessed).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={transaction.active}
                        onCheckedChange={() => toggleRecurringTransaction(transaction.id)}
                      />
                      <span className="text-xs text-gray-500">
                        {transaction.active ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteRecurringTransaction(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <RecurringTransactionDialog
          onSave={(transaction) => {
            // This will be handled by the existing RecurringTransactionDialog component
            setShowDialog(false);
          }}
        />
      </CardContent>
    </Card>
  );
};

export default RecurringTransactionsManager;
