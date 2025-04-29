
import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface GoalFormData {
  name: string;
  target: string;
  initialSaved: string;
  deadline: string;
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
  // Calculate minimum date for the deadline (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Create a New Financial Goal</h3>
        <form onSubmit={handleAddGoal} className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium block mb-1 text-gray-700">
                Goal Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Buy a Laptop"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="target" className="text-sm font-medium block mb-1 text-gray-700">
                Target Amount ($)
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
          </div>
          
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            Add Goal
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};

export default GoalCreationForm;
