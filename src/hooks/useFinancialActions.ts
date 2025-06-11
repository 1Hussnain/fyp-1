
import { useBulkOperations } from "./useBulkOperations";
import { useFinancialDataOrchestrator } from "./useFinancialDataOrchestrator";

export const useFinancialActions = () => {
  const {
    addTransaction,
    editTransaction,
    removeTransaction,
    updateBudgetLimit,
    setFilter,
    resetFilters
  } = useFinancialDataOrchestrator();

  const { handleBulkImport, handleAddRecurring } = useBulkOperations();

  const handleBudgetLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    updateBudgetLimit(value);
  };

  const handleFilterChange = (newFilter: any) => {
    setFilter(newFilter);
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  return {
    handleAddTransaction: addTransaction,
    handleEditTransaction: editTransaction,
    handleDeleteTransaction: removeTransaction,
    handleBudgetLimitChange,
    handleBulkImport,
    handleAddRecurring,
    handleFilterChange,
    handleResetFilters
  };
};
