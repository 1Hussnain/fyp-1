
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTransactions } from "@/hooks/useTransactions";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DataMigration = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { addTransaction } = useTransactions();
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const processCSV = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        if (row.length < headers.length) continue;

        const transaction = {
          amount: parseFloat(row[headers.indexOf('amount')] || '0'),
          type: (row[headers.indexOf('type')] || 'expense').toLowerCase() as 'income' | 'expense',
          description: row[headers.indexOf('description')] || '',
          date: row[headers.indexOf('date')] || new Date().toISOString().split('T')[0],
          category_id: null
        };

        if (transaction.amount > 0) {
          await addTransaction(transaction);
        }
      }

      toast({
        title: "Success",
        description: `Imported ${lines.length - 1} transactions`,
      });
      setFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-blue-700 dark:text-blue-300">
            Upload a CSV file with columns: amount, type, description, date
          </span>
        </div>
        
        <div>
          <Label htmlFor="csv-file">CSV File</Label>
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
          />
        </div>

        {file && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <FileText className="h-4 w-4" />
            <span className="text-sm">{file.name}</span>
          </div>
        )}

        <Button 
          onClick={processCSV}
          disabled={!file || loading}
          className="w-full"
        >
          {loading ? "Importing..." : "Import Transactions"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DataMigration;
