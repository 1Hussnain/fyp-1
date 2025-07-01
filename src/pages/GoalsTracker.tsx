
import React, { useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "../components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGoals } from "@/hooks/useGoals";
import GoalCreationForm from "@/components/goals/GoalCreationForm";
import GoalsList from "@/components/goals/GoalsList";
import MotivationalTips from "@/components/goals/MotivationalTips";
import { Loader2, Target, TrendingUp } from "lucide-react";

const GoalsTracker = () => {
  const {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal
  } = useGoals();

  // Local state for controlled GoalCreationForm fields
  const [formData, setFormData] = useState({
    name: "",
    target: "",
    initialSaved: "",
    deadline: "",
    type: ""
  });

  // Unified field handler
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // When submitted, dispatch to addGoal and reset form
  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    // Convert to expected backend type for addGoal
    await addGoal({
      name: formData.name,
      target_amount: Number(formData.target),
      saved_amount: Number(formData.initialSaved),
      deadline: formData.deadline,
      goal_type: formData.type,
    });
    setFormData({
      name: "",
      target: "",
      initialSaved: "",
      deadline: "",
      type: ""
    });
  };

  const handleUpdateGoal = async (id: string, updates: any) => {
    await updateGoal(id, updates);
  };

  const handleDeleteGoal = async (id: string) => {
    await deleteGoal(id);
  };

  if (loading) {
    return (
      <AppLayout pageTitle="Goals Tracker">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading your goals...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const activeGoals = goals.filter(goal => !goal.is_completed);
  const completedGoals = goals.filter(goal => goal.is_completed);

  return (
    <AppLayout pageTitle="Goals Tracker">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center py-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Financial Goals Tracker
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Set, track, and achieve your financial milestones
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{activeGoals.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Goals</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Completed Goals</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-purple-600">{goals.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Goals</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Goal Creation Form */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Create New Goal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <GoalCreationForm
                      formData={formData}
                      handleFormChange={handleFormChange}
                      handleAddGoal={handleAddGoal}
                    />
                  </CardContent>
                </Card>
                
                {/* Motivational Tips */}
                <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Motivation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MotivationalTips goals={goals} />
                  </CardContent>
                </Card>
              </div>

              {/* Goals List */}
              <div className="lg:col-span-2">
                <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Your Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <GoalsList
                      goals={goals}
                      onUpdateGoal={handleUpdateGoal}
                      onDeleteGoal={handleDeleteGoal}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default GoalsTracker;
