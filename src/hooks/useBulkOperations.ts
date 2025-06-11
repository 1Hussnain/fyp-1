
import { useToast } from "@/hooks/use-toast";
import { transactionService, FormattedTransaction } from "@/services/transactionService";

export const useBulkOperations = () => {
  const { toast } = useToast();

  const handleBulkImport = async (importedTransactions: Omit<FormattedTransaction, 'id'>[]) => {
    try {
      const results = await Promise.all(
        importedTransactions.map(transaction => 
          transactionService.createTransaction({
            type: transaction.type,
            category: transaction.category,
            source: transaction.type === "income" ? transaction.category : null,
            amount: transaction.amount,
            description: null,
            date: new Date().toISOString()
          })
        )
      );

      const successfulImports = results.filter(result => !result.error);
      const failedImports = results.filter(result => result.error);

      const newTransactions = successfulImports.map(result => 
        transactionService.formatTransaction(result.data!)
      );

      toast({
        title: "Import Complete",
        description: `Successfully imported ${successfulImports.length} transactions${
          failedImports.length > 0 ? `. ${failedImports.length} failed.` : ''
        }`,
        variant: failedImports.length > 0 ? "destructive" : "default",
      });

      return newTransactions;
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
      const result = await transactionService.createTransaction({
        type: recurringTransaction.type,
        category: recurringTransaction.category,
        source: recurringTransaction.type === "income" ? recurringTransaction.category : null,
        amount: recurringTransaction.amount,
        description: null,
        date: new Date().toISOString()
      });

      if (!result.error) {
        toast({
          title: "Recurring Transaction Added",
          description: `First occurrence of ${recurringTransaction.category} has been created.`,
        });
        return transactionService.formatTransaction(result.data);
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
