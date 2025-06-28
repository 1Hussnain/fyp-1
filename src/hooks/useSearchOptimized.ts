
import { useState, useMemo, useCallback } from 'react';
import { useTransactions } from './useTransactions';
import { useGoals } from './useGoals';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'transaction' | 'goal';
  amount?: number;
  date?: string;
}

export const useSearchOptimized = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { transactions } = useTransactions();
  const { goals } = useGoals();
  const navigate = useNavigate();

  // Memoized search results for performance
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const term = searchTerm.toLowerCase();
    const results: SearchResult[] = [];

    // Search transactions
    transactions
      .filter(t => 
        t.description?.toLowerCase().includes(term) ||
        t.categories?.name?.toLowerCase().includes(term)
      )
      .slice(0, 5) // Limit results for performance
      .forEach(transaction => {
        results.push({
          id: transaction.id,
          title: transaction.description || 'Transaction',
          description: `${transaction.type} - ${transaction.categories?.name || 'Uncategorized'}`,
          type: 'transaction',
          amount: Number(transaction.amount),
          date: transaction.date
        });
      });

    // Search goals
    goals
      .filter(g => 
        g.name?.toLowerCase().includes(term) ||
        g.description?.toLowerCase().includes(term)
      )
      .slice(0, 5) // Limit results for performance
      .forEach(goal => {
        results.push({
          id: goal.id,
          title: goal.name,
          description: goal.description || `${goal.goal_type} goal`,
          type: 'goal',
          amount: Number(goal.target_amount)
        });
      });

    return results;
  }, [searchTerm, transactions, goals]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setIsSearching(true);
    
    // Simulate search delay for UX
    setTimeout(() => setIsSearching(false), 300);
  }, []);

  const handleResultClick = useCallback((result: SearchResult) => {
    if (result.type === 'transaction') {
      navigate('/transactions');
    } else if (result.type === 'goal') {
      navigate('/goals');
    }
    setSearchTerm(''); // Clear search after navigation
  }, [navigate]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setIsSearching(false);
  }, []);

  return {
    searchTerm,
    searchResults,
    isSearching,
    handleSearch,
    handleResultClick,
    clearSearch
  };
};
