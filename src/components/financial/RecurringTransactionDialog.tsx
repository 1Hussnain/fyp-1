
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Plus } from "lucide-react";

interface RecurringTransaction {
  category: string;
  amount: number;
  type: "income" | "expense";
  frequency: "weekly" | "monthly" | "yearly";
  startDate: string;
  endDate?: string;
}

interface RecurringTransactionDialogProps {
  onSave: (recurringTransaction: RecurringTransaction) => void;
}

const RecurringTransactionDialog: React.FC<RecurringTransactionDialogProps> = ({
  onSave,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    type: "expense" as "income" | "expense",
    frequency: "monthly" as "weekly" | "monthly" | "yearly",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
  });

  const handleSave = () => {
    if (!formData.category.trim() || !formData.amount || !formData.startDate) return;

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) return;

    const recurringTransaction: RecurringTransaction = {
      category: formData.category.trim(),
      amount,
      type: formData.type,
      frequency: formData.frequency,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
    };

    onSave(recurringTransaction);
    
    // Reset form
    setFormData({
      category: "",
      amount: "",
      type: "expense",
      frequency: "monthly",
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
    });
    
    setIsOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          <Plus className="mr-2 h-4 w-4" />
          Add Recurring
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Recurring Transaction</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income">Income</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense">Expense</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              placeholder="e.g. Rent, Salary, Utilities"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={formData.frequency} onValueChange={(value) => handleInputChange("frequency", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                min={formData.startDate}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.category.trim() || !formData.amount || parseFloat(formData.amount) <= 0 || !formData.startDate}
          >
            Add Recurring Transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecurringTransactionDialog;
