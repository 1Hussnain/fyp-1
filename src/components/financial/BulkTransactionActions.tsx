
import React, { useState } from "react";
import { Upload, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Transaction {
  id: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}

interface BulkTransactionActionsProps {
  transactions: Transaction[];
  onBulkImport: (transactions: Omit<Transaction, 'id'>[]) => void;
}

const BulkTransactionActions: React.FC<BulkTransactionActionsProps> = ({
  transactions,
  onBulkImport,
}) => {
  const { toast } = useToast();
  const [isImportOpen, setIsImportOpen] = useState(false);

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      toast({
        title: "No Data",
        description: "No transactions to export",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Date", "Type", "Category", "Amount"];
    const csvContent = [
      headers.join(","),
      ...transactions.map(t => [
        t.date,
        t.type,
        `"${t.category}"`,
        t.amount.toString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Transactions exported to CSV file",
    });
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          throw new Error("CSV file must have at least a header and one data row");
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const requiredHeaders = ['date', 'type', 'category', 'amount'];
        
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
          throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
        }

        const dateIndex = headers.indexOf('date');
        const typeIndex = headers.indexOf('type');
        const categoryIndex = headers.indexOf('category');
        const amountIndex = headers.indexOf('amount');

        const importedTransactions: Omit<Transaction, 'id'>[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          
          if (values.length < 4) continue;

          const type = values[typeIndex].toLowerCase();
          if (type !== 'income' && type !== 'expense') {
            console.warn(`Skipping row ${i + 1}: Invalid type "${type}"`);
            continue;
          }

          const amount = parseFloat(values[amountIndex]);
          if (isNaN(amount) || amount <= 0) {
            console.warn(`Skipping row ${i + 1}: Invalid amount "${values[amountIndex]}"`);
            continue;
          }

          importedTransactions.push({
            date: values[dateIndex] || new Date().toLocaleDateString(),
            type: type as "income" | "expense",
            category: values[categoryIndex] || "Other",
            amount,
          });
        }

        if (importedTransactions.length === 0) {
          throw new Error("No valid transactions found in CSV file");
        }

        onBulkImport(importedTransactions);
        setIsImportOpen(false);
        
        toast({
          title: "Import Successful",
          description: `Imported ${importedTransactions.length} transactions`,
        });

      } catch (error) {
        toast({
          title: "Import Error",
          description: error instanceof Error ? error.message : "Failed to import CSV",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleExportCSV}
        className="text-xs"
      >
        <Download className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
      
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="text-xs">
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Transactions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <p className="mb-2">CSV file should have the following columns:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>date</strong> - Transaction date</li>
                <li><strong>type</strong> - "income" or "expense"</li>
                <li><strong>category</strong> - Transaction category</li>
                <li><strong>amount</strong> - Transaction amount (number)</li>
              </ul>
            </div>
            <Input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="cursor-pointer"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BulkTransactionActions;
