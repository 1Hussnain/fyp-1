
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useGoals } from "@/hooks/useGoals";
import GoalCreationForm from "@/components/goals/GoalCreationForm";
import GoalsList from "@/components/goals/GoalsList";
import MotivationalTips from "@/components/goals/MotivationalTips";
import { useToast } from "@/hooks/use-toast";
import FastLoadingSpinner from "@/components/ui/FastLoadingSpinner";

const GoalsTracker = () => {
  const {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal
  } = useGoals();

  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    target: "",
    initialSaved: "",
    deadline: "",
    type: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('[GoalsTracker] Adding goal with data:', formData);
      
      const goalData = {
        name: formData.name.trim(),
        target_amount: parseFloat(formData.target),
        saved_amount: formData.initialSaved ? parseFloat(formData.initialSaved) : 0,
        deadline: formData.deadline || null,
        goal_type: formData.type,
        description: null,
        priority: 'medium' as const
      };

      const result = await addGoal(goalData);
      
      if (result && result.success) {
        setFormData({
          name: "",
          target: "",
          initialSaved: "",
          deadline: "",
          type: ""
        });
        
        toast({
          title: "Success",
          description: "Goal created successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: result?.error || "Failed to create goal",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('[GoalsTracker] Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateGoal = async (id: string, updates: any) => {
    try {
      const result = await updateGoal(id, updates);
      if (result && result.success) {
        toast({
          title: "Success",
          description: "Goal updated successfully!",
        });
      }
    } catch (error) {
      console.error('[GoalsTracker] Error updating goal:', error);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      const result = await deleteGoal(id);
      if (result && result.success) {
        toast({
          title: "Success",
          description: "Goal deleted successfully!",
        });
      }
    } catch (error) {
      console.error('[GoalsTracker] Error deleting goal:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FastLoadingSpinner size="lg" text="Loading your goals..." />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-6"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Financial Goals Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Set and track your financial objectives
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <GoalCreationForm
            formData={formData}
            handleFormChange={handleFormChange}
            handleAddGoal={handleAddGoal}
          />
          <MotivationalTips goals={goals} />
        </div>
        <div className="lg:col-span-2">
          <GoalsList
            goals={goals}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default GoalsTracker;
