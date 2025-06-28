
import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface GoalFormData {
  name: string;
  target: string;
  initialSaved: string;
  deadline: string;
  type: string;
}

interface GoalCreationFormProps {
  formData: GoalFormData;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddGoal: (e: React.FormEvent) => void;
}

const GoalCreationForm: React.FC<GoalCreationFormProps> = ({
  formData,
  handleFormChange,
  handleAddGoal,
}) => {
  const { toast } = useToast();
  const today = new Date().toISOString().split("T")[0];

  const handleTypeChange = (value: string) => {
    const event = {
      target: { name: "type", value }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleFormChange(event);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Goal name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.target || parseFloat(formData.target) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid target amount",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.type) {
      toast({
        title: "Error",
        description: "Please select a goal type",
        variant: "destructive",
      });
      return;
    }

    handleAddGoal(e);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">Create a New Financial Goal</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium block mb-1 text-gray-700">
                Goal Name *
              </label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Buy a Laptop"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="target" className="text-sm font-medium block mb-1 text-gray-700">
                  Target Amount ($) *
                </label>
                <Input
                  id="target"
                  name="target"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="e.g., 1000"
                  value={formData.target}
                  onChange={handleFormChange}
                  className="w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="initialSaved" className="text-sm font-medium block mb-1 text-gray-700">
                  Initial Savings ($)
                </label>
                <Input
                  id="initialSaved"
                  name="initialSaved"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={formData.initialSaved}
                  onChange={handleFormChange}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="deadline" className="text-sm font-medium block mb-1 text-gray-700">
                  Target Date
                </label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  min={today}
                  value={formData.deadline}
                  onChange={handleFormChange}
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="type" className="text-sm font-medium block mb-1 text-gray-700">
                  Goal Type *
                </label>
                <Select 
                  name="type" 
                  value={formData.type} 
                  onValueChange={handleTypeChange}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="debt_repayment">Debt Repayment</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="emergency_fund">Emergency Fund</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 px-8 py-2 text-white font-medium rounded-lg transition-colors"
            >
              Add Goal
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default GoalCreationForm;
