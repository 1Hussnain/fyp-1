
import { useState, useMemo } from "react";
import { useTransactions } from "./useTransactions";

interface FilterOptions {
  type: 'all' | 'income' | 'expense';
  category: string;
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
}

export const useTransactionFilters = () => {
  const { transactions } = useTransactions();
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    category: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Type filter
      if (filters.type !== 'all' && transaction.type !== filters.type) {
        return false;
      }

      // Category filter
      if (filters.category && transaction.categories?.name !== filters.category) {
        return false;
      }

      // Date filters
      if (filters.dateFrom && transaction.date < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && transaction.date > filters.dateTo) {
        return false;
      }

      // Amount filters
      const amount = Number(transaction.amount);
      if (filters.amountMin && amount < Number(filters.amountMin)) {
        return false;
      }
      if (filters.amountMax && amount > Number(filters.amountMax)) {
        return false;
      }

      return true;
    });
  }, [transactions, filters]);

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      type: 'all',
      category: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: ''
    });
  };

  return {
    filteredTransactions,
    filters,
    updateFilter,
    resetFilters
  };
};
