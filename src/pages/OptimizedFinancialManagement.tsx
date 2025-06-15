import React from "react";
import { useOptimizedFinancial } from "@/hooks/useOptimizedFinancial";
import { Loader2 } from "lucide-react";
import OptimizedTransactionTable from "@/components/financial/OptimizedTransactionTable";
import OptimizedCategoryChart from "@/components/financial/OptimizedCategoryChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeDollarSign, ArrowUp, ArrowDown, Landmark } from "lucide-react";
import TabbedTransactionForm from "@/components/financial/TabbedTransactionForm";

const StatCard = ({ title, value, icon, change }: { title: string, value: number, icon: React.ReactNode, change?: number }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        ${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    </CardContent>
  </Card>
);

const OptimizedFinancialManagement = () => {
  const {
    transactions,
    categories,
    summary,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory
  } = useOptimizedFinancial();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Income" value={summary.totalIncome} icon={<BadgeDollarSign className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Total Expenses" value={summary.totalExpenses} icon={<BadgeDollarSign className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Net Income" value={summary.netIncome} icon={<Landmark className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Transactions" value={summary.transactionCount} icon={<Landmark className="h-4 w-4 text-muted-foreground" />} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <TabbedTransactionForm 
            categories={categories}
            onAddTransaction={addTransaction}
          />
        </div>
        
        <div className="lg:col-span-2">
          <OptimizedCategoryChart 
            categorySpending={summary.categorySpending} 
            totalExpenses={summary.totalExpenses} 
          />
        </div>
      </div>

      <div>
        <OptimizedTransactionTable
          transactions={transactions}
          onUpdateTransaction={updateTransaction}
          onDeleteTransaction={deleteTransaction}
        />
      </div>
    </div>
  );
};

export default OptimizedFinancialManagement;
