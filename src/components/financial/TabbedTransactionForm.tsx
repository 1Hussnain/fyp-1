
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/types/database";

interface TabbedTransactionFormProps {
  categories: Category[];
  onAddTransaction: (data: {
    amount: number;
    type: 'income' | 'expense';
    category_id: string;
    description?: string;
    date?: string;
  }) => Promise<boolean>;
}

const TabbedTransactionForm: React.FC<TabbedTransactionFormProps> = ({
  categories,
  onAddTransaction,
}) => {
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [formData, setFormData] = useState({
    amount: '',
    category_id: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'expense' | 'income');
    // Reset form when switching tabs
    setFormData({
      amount: '',
      category_id: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category_id) return;

    setLoading(true);
    const success = await onAddTransaction({
      amount: parseFloat(formData.amount),
      type: activeTab,
      category_id: formData.category_id,
      description: formData.description || undefined,
      date: formData.date,
    });

    if (success) {
      setFormData({
        amount: '',
        category_id: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setLoading(false);
  };

  const filteredCategories = categories.filter((cat) => cat.type === activeTab);
  const capitalisedTab = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Income / Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expense">Expense</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
          </TabsList>
          <TabsContent value="expense">
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* Form fields */}
              <div>
                <Label htmlFor="amount-expense">Amount</Label>
                <Input
                  id="amount-expense"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category-expense">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => handleInputChange('category_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date-expense">Date</Label>
                <Input
                  id="date-expense"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description-expense">Description (Optional)</Label>
                <Textarea
                  id="description-expense"
                  placeholder="e.g. Groceries, rent..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={2}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !formData.amount || !formData.category_id}
              >
                {loading ? 'Adding...' : `Add Expense`}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="income">
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* Form fields */}
              <div>
                <Label htmlFor="amount-income">Amount</Label>
                <Input
                  id="amount-income"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category-income">Source</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => handleInputChange('category_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a source" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date-income">Date</Label>
                <Input
                  id="date-income"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description-income">Description (Optional)</Label>
                <Textarea
                  id="description-income"
                  placeholder="e.g. Salary, freelance project..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={2}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !formData.amount || !formData.category_id}
              >
                {loading ? 'Adding...' : `Add Income`}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TabbedTransactionForm;
