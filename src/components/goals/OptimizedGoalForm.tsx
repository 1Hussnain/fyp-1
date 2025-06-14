
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { FinancialGoal } from "@/services/optimizedFinancialService";

interface OptimizedGoalFormProps {
  onAddGoal: (data: Omit<FinancialGoal, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'is_completed'>) => Promise<boolean>;
}

const OptimizedGoalForm: React.FC<OptimizedGoalFormProps> = ({ onAddGoal }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    target_amount: '',
    saved_amount: '0',
    goal_type: 'other' as const,
    priority: 'medium' as const,
    deadline: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.target_amount || !formData.deadline) return;

    setLoading(true);
    const success = await onAddGoal({
      name: formData.name,
      description: formData.description || null,
      target_amount: parseFloat(formData.target_amount),
      saved_amount: parseFloat(formData.saved_amount) || 0,
      goal_type: formData.goal_type,
      priority: formData.priority,
      deadline: formData.deadline
    });

    if (success) {
      setFormData({
        name: '',
        description: '',
        target_amount: '',
        saved_amount: '0',
        goal_type: 'other',
        priority: 'medium',
        deadline: ''
      });
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Goal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              placeholder="e.g., Emergency Fund"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your goal..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="target_amount">Target Amount</Label>
              <Input
                id="target_amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.target_amount}
                onChange={(e) => setFormData(prev => ({ ...prev, target_amount: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="saved_amount">Initial Saved</Label>
              <Input
                id="saved_amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.saved_amount}
                onChange={(e) => setFormData(prev => ({ ...prev, saved_amount: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="goal_type">Goal Type</Label>
              <Select 
                value={formData.goal_type} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, goal_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergency">Emergency Fund</SelectItem>
                  <SelectItem value="vacation">Vacation</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="debt">Debt Payoff</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Goal"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OptimizedGoalForm;
