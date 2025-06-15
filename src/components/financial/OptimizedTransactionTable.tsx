
import React from "react";
import { TransactionWithCategory } from "@/types/database";

interface OptimizedTransactionTableProps {
  transactions: TransactionWithCategory[];
  onUpdateTransaction: (id: string, updates: any) => Promise<boolean>;
  onDeleteTransaction: (id: string) => Promise<boolean>;
}

const OptimizedTransactionTable: React.FC<OptimizedTransactionTableProps> = ({
  transactions,
  onUpdateTransaction,
  onDeleteTransaction,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Date</th>
            <th className="px-4 py-2 border-b">Type</th>
            <th className="px-4 py-2 border-b">Category</th>
            <th className="px-4 py-2 border-b">Amount</th>
            <th className="px-4 py-2 border-b">Description</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td className="px-4 py-2 border-b">{t.date}</td>
              <td className="px-4 py-2 border-b capitalize">{t.type}</td>
              <td className="px-4 py-2 border-b">{t.categories?.name || "Uncategorized"}</td>
              <td className="px-4 py-2 border-b">${t.amount.toFixed(2)}</td>
              <td className="px-4 py-2 border-b">{t.description ?? ""}</td>
              <td className="px-4 py-2 border-b">
                <button
                  className="text-blue-500 hover:underline mr-2"
                  onClick={() =>
                    onUpdateTransaction(t.id, {
                      // This would usually open a dialog/modal, but here we just call the handler for demo
                      ...t,
                    })
                  }
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => onDeleteTransaction(t.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-400">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* You can add a custom add transaction form here if needed */}
    </div>
  );
};

export default OptimizedTransactionTable;
