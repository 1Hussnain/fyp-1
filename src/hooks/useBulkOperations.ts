
import { useToast } from "@/hooks/use-toast";
import { optimizedFinancialService, TransactionWithCategory } from "@/services/optimizedFinancialService";

export const useBulkOperations = () => {
  const { toast } = useToast();

  const handleBulkImport = async (importedTransactions: Omit<TransactionWithCategory, 'id' | 'created_at' | 'updated_at'>[]) => {
    try {
      const results = await Promise.all(
        importedTransactions.map(transaction => 
          optimizedFinancialService.createTransaction({
            type: transaction.type as 'income' | 'expense',
            category_id: transaction.category_id,
            amount: Number(transaction.amount),
            description: transaction.description,
            date: transaction.date,
            user_id: transaction.user_id
          })
        )
      );

      const successfulImports = results.filter(result => !result.error);
      const failedImports = results.filter(result => result.error);

      toast({
        title: "Import Complete",
        description: `Successfully imported ${successfulImports.length} transactions${
          failedImports.length > 0 ? `. ${failedImports.length} failed.` : ''
        }`,
        variant: failedImports.length > 0 ? "destructive" : "default",
      });

      return successfulImports.map(result => result.data).filter(Boolean);
    } catch (err) {
      console.error("Error importing transactions:", err);
      toast({
        title: "Error",
        description: "Failed to import transactions",
        variant: "destructive",
      });
      return [];
    }
  };

  const handleAddRecurring = async (recurringTransaction: any) => {
    try {
      const result = await optimizedFinancialService.createTransaction({
        type: recurringTransaction.type,
        category_id: recurringTransaction.category_id,
        amount: Number(recurringTransaction.amount),
        description: recurringTransaction.description || null,
        date: new Date().toISOString().split('T')[0],
        user_id: recurringTransaction.user_id
      });

      if (!result.error) {
        toast({
          title: "Recurring Transaction Added",
          description: `Transaction has been created.`,
        });
        return result.data;
      }
    } catch (err) {
      console.error("Error adding recurring transaction:", err);
      toast({
        title: "Error",
        description: "Failed to add recurring transaction",
        variant: "destructive",
      });
    }
    return null;
  };

  return {
    handleBulkImport,
    handleAddRecurring
  };
};
