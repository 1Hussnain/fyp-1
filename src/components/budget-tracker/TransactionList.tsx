
import React from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";

interface Transaction {
  id: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
      {transactions.length === 0 ? (
        <p className="text-center text-gray-500 my-6">No transactions yet. Add your first one above!</p>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {transactions.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border text-sm"
            >
              <div>
                <p className="font-medium">{item.category}</p>
                <p className="text-xs text-gray-500">{item.date}</p>
              </div>
              <div className={`flex items-center ${item.type === "expense" ? "text-red-600" : "text-green-600"}`}>
                {item.type === "expense" ? (
                  <ArrowDown className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowUp className="h-3 w-3 mr-1" />
                )}
                ${item.amount.toFixed(2)}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
