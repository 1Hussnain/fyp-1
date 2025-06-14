import React from "react";
import { useRecurringTransactions } from "@/hooks/useRecurringTransactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const RecurringTransactionsManager = () => {
  const {
    recurringTransactions,
    addRecurringTransaction,
    toggleRecurringTransaction,
    deleteRecurringTransaction
  } = useRecurringTransactions();

  const [type, setType] = React.useState<"income" | "expense">("expense");
  const [frequency, setFrequency] = React.useState<"weekly" | "monthly" | "yearly">("monthly");
  const [amount, setAmount] = React.useState<number>(0);
  const [description, setDescription] = React.useState<string>("");
  const [categoryName, setCategoryName] = React.useState<string>("");

  const handleAdd = () => {
    addRecurringTransaction({
      type,
      frequency,
      amount,
      description,
      startDate: new Date().toISOString().split('T')[0],
      category_id: null,
      categoryName
    });

    // Reset form
    setType("expense");
    setFrequency("monthly");
    setAmount(0);
    setDescription("");
    setCategoryName("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recurring Transactions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="frequency">Frequency</Label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          type="text"
          id="category"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </div>

      <Button onClick={handleAdd}>Add Recurring Transaction</Button>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Current Recurring Transactions</h3>
        {recurringTransactions.length === 0 ? (
          <p>No recurring transactions added yet.</p>
        ) : (
          <div className="space-y-3">
            {recurringTransactions.map((transaction) => (
              <div key={transaction.id}>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{transaction.description}</span>
                      <Badge variant={transaction.type === 'income' ? 'default' : 'destructive'}>
                        {transaction.type}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="mr-4">Amount: ${transaction.amount}</span>
                      <span className="mr-4">Frequency: {transaction.frequency}</span>
                      <span>Category: {transaction.categoryName || 'Uncategorized'}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleRecurringTransaction(transaction.id)}
                    >
                      {transaction.active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteRecurringTransaction(transaction.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecurringTransactionsManager;
