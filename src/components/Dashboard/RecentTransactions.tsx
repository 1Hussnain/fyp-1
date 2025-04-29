
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const rowVariant = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 }
};

const RecentTransactions = () => {
  const transactions = [
    { id: 1, description: "Salary Deposit", amount: "+$4,250.00", category: "Income", date: "Apr 28, 2025", type: "income" },
    { id: 2, description: "Rent Payment", amount: "-$1,800.00", category: "Housing", date: "Apr 26, 2025", type: "expense" },
    { id: 3, description: "Grocery Store", amount: "-$156.42", category: "Food", date: "Apr 24, 2025", type: "expense" },
    { id: 4, description: "Freelance Work", amount: "+$850.00", category: "Income", date: "Apr 22, 2025", type: "income" },
    { id: 5, description: "Online Subscription", amount: "-$19.99", category: "Entertainment", date: "Apr 20, 2025", type: "expense" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="bg-white p-6 rounded-xl shadow mt-6"
    >
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="hidden sm:table-cell">Category</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.description}</TableCell>
              <TableCell className={transaction.type === "income" ? "text-green-500" : "text-red-500"}>
                {transaction.amount}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {transaction.category}
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell">{transaction.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default RecentTransactions;
