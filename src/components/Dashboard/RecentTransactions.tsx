
import React from "react";
import { motion } from "framer-motion";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useTransactions } from "@/hooks/useTransactions";
import { Skeleton } from "@/components/ui/skeleton";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const RecentTransactions = () => {
  const { transactions, loading } = useTransactions();
  
  // Get the 5 most recent transactions
  const recentTransactions = transactions.slice(0, 5);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-white p-6 rounded-xl shadow mt-6"
      >
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="bg-white p-6 rounded-xl shadow mt-6"
    >
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      
      {recentTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No transactions yet</p>
          <p className="text-sm mt-1">Add your first transaction to see it here</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.category}</TableCell>
                <TableCell className={transaction.type === "income" ? "text-green-500" : "text-red-500"}>
                  {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                    transaction.type === "income" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {transaction.type}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">{transaction.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </motion.div>
  );
};

export default RecentTransactions;
