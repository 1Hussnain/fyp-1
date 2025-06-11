
import { useState, useMemo } from "react";
import { FormattedTransaction } from "@/services/transactionService";

interface TransactionFilter {
  type: "all" | "income" | "expense";
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export const useTransactionFilters = (transactions: FormattedTransaction[]) => {
  const [filter, setFilter] = useState<TransactionFilter>({
    type: "all",
    startDate: undefined,
    endDate: undefined
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Filter by type
      if (filter.type !== "all" && transaction.type !== filter.type) {
        return false;
      }

      // Filter by date range
      if (filter.startDate || filter.endDate) {
        const transactionDate = new Date(transaction.date);
        
        if (filter.startDate && transactionDate < filter.startDate) {
          return false;
        }
        
        if (filter.endDate) {
          const endOfDay = new Date(filter.endDate);
          endOfDay.setHours(23, 59, 59, 999);
          if (transactionDate > endOfDay) {
            return false;
          }
        }
      }
      
      return true;
    });
  }, [transactions, filter]);

  const handleFilterChange = (newFilter: TransactionFilter) => {
    setFilter(newFilter);
  };

  const handleResetFilters = () => {
    setFilter({
      type: "all",
      startDate: undefined,
      endDate: undefined
    });
  };

  return {
    filter,
    filteredTransactions,
    handleFilterChange,
    handleResetFilters
  };
};
