
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Transaction {
  id: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}

interface EditTransactionDialogProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Transaction>) => void;
}

const EditTransactionDialog: React.FC<EditTransactionDialogProps> = ({
  transaction,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    type: "expense" as "income" | "expense",
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        category: transaction.category,
        amount: transaction.amount.toString(),
        type: transaction.type,
      });
    }
  }, [transaction]);

  const handleSave = () => {
    if (!transaction || !formData.category.trim() || !formData.amount) return;

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) return;

    onSave(transaction.id, {
      category: formData.category.trim(),
      amount,
      type: formData.type,
    });

    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
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
              placeholder="Enter category"
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.category.trim() || !formData.amount || parseFloat(formData.amount) <= 0}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionDialog;
