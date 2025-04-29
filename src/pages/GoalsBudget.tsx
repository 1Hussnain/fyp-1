
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface Goal {
  name: string;
  target: number;
  deadline: string;
  saved: number;
  startDate: string;
}

interface Budget {
  category: string;
  limit: number;
  notes: string;
  used: number;
}

const GoalsBudget = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goalForm, setGoalForm] = useState({ name: "", target: "", deadline: "" });
  const [budgetForm, setBudgetForm] = useState({ category: "", limit: "", notes: "" });

  // Goal handlers
  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoalForm({ ...goalForm, [e.target.name]: e.target.value });
  };

  const addGoal = () => {
    if (!goalForm.name || !goalForm.target || !goalForm.deadline) {
      toast({
        title: "Error",
        description: "All goal fields are required",
        variant: "destructive",
      });
      return;
    }
    
    const newGoal: Goal = {
      name: goalForm.name,
      target: parseFloat(goalForm.target),
      deadline: goalForm.deadline,
      saved: 0,
      startDate: new Date().toLocaleDateString(),
    };
    
    setGoals([newGoal, ...goals]);
    setGoalForm({ name: "", target: "", deadline: "" });
    toast({
      title: "Goal Added",
      description: `${newGoal.name} has been added to your goals`,
    });
  };

  const saveToGoal = (index: number, amount = 100) => {
    const updated = [...goals];
    updated[index].saved += amount;
    setGoals(updated);
    toast({
      title: "Saved to Goal",
      description: `$${amount} added to ${goals[index].name}`,
    });
  };

  // Budget handlers
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudgetForm({ ...budgetForm, [e.target.name]: e.target.value });
  };

  const addBudget = () => {
    if (!budgetForm.category || !budgetForm.limit) {
      toast({
        title: "Error",
        description: "Category and limit are required",
        variant: "destructive",
      });
      return;
    }
    
    const newBudget: Budget = {
      category: budgetForm.category,
      limit: parseFloat(budgetForm.limit),
      notes: budgetForm.notes,
      used: 0,
    };
    
    setBudgets([newBudget, ...budgets]);
    setBudgetForm({ category: "", limit: "", notes: "" });
    toast({
      title: "Budget Added",
      description: `${newBudget.category} budget has been created`,
    });
  };

  const useBudget = (index: number, amount = 50) => {
    const updated = [...budgets];
    updated[index].used += amount;
    setBudgets(updated);
    toast({
      title: "Budget Used",
      description: `$${amount} used from ${budgets[index].category} budget`,
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Goals & Budget</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Goals Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Financial Goals</h3>
            
            <Card className="p-4 mb-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-sm font-medium mb-1 block text-gray-700">
                    Goal Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Emergency Fund, Vacation"
                    value={goalForm.name}
                    onChange={handleGoalChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="target" className="text-sm font-medium mb-1 block text-gray-700">
                    Target Amount ($)
                  </label>
                  <Input
                    id="target"
                    name="target"
                    type="number"
                    min="0"
                    placeholder="5000"
                    value={goalForm.target}
                    onChange={handleGoalChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="deadline" className="text-sm font-medium mb-1 block text-gray-700">
                    Deadline
                  </label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={goalForm.deadline}
                    onChange={handleGoalChange}
                  />
                </div>
                
                <Button onClick={addGoal} className="w-full bg-green-600 hover:bg-green-700">
                  Add Goal
                </Button>
              </div>
            </Card>
            
            <div className="h-64 overflow-y-auto border rounded-xl p-4">
              {goals.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p>No goals set yet.</p>
                  <p className="text-sm">Add your first goal above.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {goals.map((goal, index) => {
                    const percent = Math.min((goal.saved / goal.target) * 100, 100);
                    
                    return (
                      <Card key={index} className="p-4">
                        <h4 className="font-bold text-lg">{goal.name}</h4>
                        <p className="text-sm text-gray-500">
                          Target: ${goal.target.toFixed(2)} | Saved: ${goal.saved.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">
                          Deadline: {goal.deadline} | Started: {goal.startDate}
                        </p>
                        <div className="mt-2">
                          <Progress value={percent} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm text-green-600">{percent.toFixed(1)}%</p>
                          <Button 
                            onClick={() => saveToGoal(index)} 
                            size="sm" 
                            className="text-xs bg-green-600 hover:bg-green-700"
                          >
                            + Save $100
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
          
          {/* Budget Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Monthly Budget</h3>
            
            <Card className="p-4 mb-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="category" className="text-sm font-medium mb-1 block text-gray-700">
                    Category
                  </label>
                  <Input
                    id="category"
                    name="category"
                    placeholder="e.g., Groceries, Rent, Entertainment"
                    value={budgetForm.category}
                    onChange={handleBudgetChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="limit" className="text-sm font-medium mb-1 block text-gray-700">
                    Monthly Limit ($)
                  </label>
                  <Input
                    id="limit"
                    name="limit"
                    type="number"
                    min="0"
                    placeholder="500"
                    value={budgetForm.limit}
                    onChange={handleBudgetChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="notes" className="text-sm font-medium mb-1 block text-gray-700">
                    Notes (Optional)
                  </label>
                  <Input
                    id="notes"
                    name="notes"
                    placeholder="Additional details..."
                    value={budgetForm.notes}
                    onChange={handleBudgetChange}
                  />
                </div>
                
                <Button onClick={addBudget} className="w-full">
                  Add Budget Category
                </Button>
              </div>
            </Card>
            
            <div className="h-64 overflow-y-auto border rounded-xl p-4">
              {budgets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p>No budget categories yet.</p>
                  <p className="text-sm">Add your first budget category above.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {budgets.map((budget, index) => {
                    const percent = Math.min((budget.used / budget.limit) * 100, 100);
                    const isOverBudget = percent >= 100;
                    
                    return (
                      <Card key={index} className="p-4">
                        <h4 className="font-bold text-lg">{budget.category}</h4>
                        <p className="text-sm text-gray-500">
                          Limit: ${budget.limit.toFixed(2)} | Used: ${budget.used.toFixed(2)}
                        </p>
                        {budget.notes && (
                          <p className="text-xs text-gray-400">{budget.notes}</p>
                        )}
                        <div className="mt-2">
                          <Progress 
                            value={percent} 
                            className={`h-2 ${isOverBudget ? "[&>div]:bg-red-500" : "[&>div]:bg-blue-500"}`} 
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className={`text-sm ${isOverBudget ? "text-red-600" : "text-blue-600"}`}>
                            {percent.toFixed(1)}%
                          </p>
                          <Button 
                            onClick={() => useBudget(index)} 
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            + Use $50
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default GoalsBudget;
