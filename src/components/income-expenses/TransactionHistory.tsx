
import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  source?: string;
  category?: string;
  date: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  return (
    <div className="border rounded-xl p-4">
      <ScrollArea className="h-64">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No transactions yet.</p>
            <p className="text-sm">Add your first transaction above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center p-3 rounded-lg border bg-white"
              >
                <div>
                  <p className="font-medium">
                    {transaction.type === "income" ? transaction.source : transaction.category}
                  </p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
                
                <Badge 
                  variant={transaction.type === "income" ? "default" : "outline"}
                  className={transaction.type === "income" 
                    ? "bg-green-100 hover:bg-green-200 text-green-800 hover:text-green-800" 
                    : "bg-red-100 hover:bg-red-200 text-red-800 hover:text-red-800 border-red-200"}
                >
                  {transaction.type === "income" ? "+" : "-"} 
                  ${transaction.amount.toFixed(2)}
                </Badge>
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default TransactionHistory;
