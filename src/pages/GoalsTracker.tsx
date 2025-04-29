
import React from "react";
import { motion } from "framer-motion";
import { useGoals } from "@/hooks/useGoals";
import GoalCreationForm from "@/components/goals/GoalCreationForm";
import GoalsList from "@/components/goals/GoalsList";
import MotivationalTips from "@/components/goals/MotivationalTips";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Clock, Target, Award } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GoalsTracker = () => {
  const {
    goals,
    formData,
    handleFormChange,
    handleAddGoal,
    handleAddSavings,
    getRandomMotivationalTip,
    deletedGoalName,
    setDeletedGoalName,
    handleDeleteGoal,
    goalTypeFilter,
    setGoalTypeFilter,
    getFilteredGoals,
    daysLeft,
    getProgress,
  } = useGoals();

  const activeGoals = goals.filter(goal => (goal.saved / goal.target) * 100 < 100);
  const achievedGoals = goals.filter(goal => (goal.saved / goal.target) * 100 >= 100);
  const missedGoals = goals.filter(goal => {
    const deadline = new Date(goal.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return deadline < today && (goal.saved / goal.target) * 100 < 100;
  });
  
  return (
    <div className="max-w-6xl mx-auto px-6 py-8 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">🎯 Financial Goals Tracker</h1>
          <p className="text-gray-600">Set, track, and achieve your financial dreams one milestone at a time.</p>
          
          <div className="mt-4 flex justify-center">
            <select 
              className="px-4 py-2 border rounded-lg text-sm"
              value={goalTypeFilter}
              onChange={(e) => setGoalTypeFilter(e.target.value)}
            >
              <option value="all">All Goals</option>
              <option value="short-term">Short-Term</option>
              <option value="long-term">Long-Term</option>
            </select>
          </div>
        </header>

        <GoalCreationForm 
          formData={formData} 
          handleFormChange={handleFormChange} 
          handleAddGoal={handleAddGoal} 
        />

        <Tabs defaultValue="active" className="mt-10">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Active Goals
              {activeGoals.length > 0 && (
                <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{activeGoals.length}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="achieved" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Achieved
              {achievedGoals.length > 0 && (
                <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{achievedGoals.length}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="missed" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Missed
              {missedGoals.length > 0 && (
                <span className="ml-1 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">{missedGoals.length}</span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {getFilteredGoals().filter(goal => (goal.saved / goal.target) * 100 < 100).length > 0 ? (
              <GoalsList 
                goals={getFilteredGoals().filter(goal => (goal.saved / goal.target) * 100 < 100)} 
                handleAddSavings={handleAddSavings}
                handleDeleteGoal={handleDeleteGoal}
              />
            ) : (
              <motion.div 
                className="p-8 bg-gray-50 rounded-xl border border-gray-200 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Active Goals</h3>
                <p className="text-gray-500 mb-4">{goalTypeFilter === "all" ? "You don't have any active goals yet." : `You don't have any active ${goalTypeFilter} goals yet.`}</p>
                <p className="text-sm text-purple-600">Create your first goal above to start tracking your progress.</p>
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="achieved">
            {getFilteredGoals().filter(goal => (goal.saved / goal.target) * 100 >= 100).length > 0 ? (
              <GoalsList 
                goals={getFilteredGoals().filter(goal => (goal.saved / goal.target) * 100 >= 100)} 
                handleAddSavings={handleAddSavings}
                handleDeleteGoal={handleDeleteGoal}
              />
            ) : (
              <motion.div 
                className="p-8 bg-gray-50 rounded-xl border border-gray-200 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Achieved Goals Yet</h3>
                <p className="text-gray-500 mb-4">Keep working towards your financial targets!</p>
                <p className="text-sm text-purple-600">Your completed goals will appear here.</p>
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="missed">
            {getFilteredGoals().filter(goal => {
              const deadline = new Date(goal.deadline);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return deadline < today && (goal.saved / goal.target) * 100 < 100;
            }).length > 0 ? (
              <GoalsList 
                goals={getFilteredGoals().filter(goal => {
                  const deadline = new Date(goal.deadline);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return deadline < today && (goal.saved / goal.target) * 100 < 100;
                })} 
                handleAddSavings={handleAddSavings}
                handleDeleteGoal={handleDeleteGoal}
              />
            ) : (
              <motion.div 
                className="p-8 bg-gray-50 rounded-xl border border-gray-200 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Missed Goals</h3>
                <p className="text-gray-500 mb-4">Great job staying on track with your deadlines!</p>
                <p className="text-sm text-purple-600">Keep up the good work.</p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>

        <MotivationalTips goals={goals} getRandomMotivationalTip={getRandomMotivationalTip} />
        
        <div className="mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">💡 Smart Recommendations</h2>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              {goals.length > 0 ? (
                <ul className="space-y-3">
                  {goals.map(goal => {
                    const pct = goal.saved / goal.target;
                    const daysRemaining = typeof daysLeft(goal.deadline) === 'number' ? daysLeft(goal.deadline) : 0;
                    const amountRemaining = goal.target - goal.saved;
                    const progress = getProgress(goal);
                    const isOverdue = typeof daysLeft(goal.deadline) === 'string' && daysLeft(goal.deadline).includes('Overdue');
                    
                    if (progress >= 100) {
                      return (
                        <li key={goal.id} className="p-3 bg-green-50 rounded-lg text-sm text-gray-700">
                          ✅ Great job! You've achieved your "{goal.name}" goal! Consider setting a new goal or increasing your target.
                        </li>
                      );
                    }
                    
                    if (isOverdue) {
                      return (
                        <li key={goal.id} className="p-3 bg-red-50 rounded-lg text-sm text-gray-700">
                          ❌ You missed your deadline for "{goal.name}". Consider adjusting the deadline or modifying your saving strategy.
                        </li>
                      );
                    }
                    
                    if (pct < 0.5 && daysRemaining < 30 && daysRemaining > 0) {
                      const dailySavingsNeeded = Math.round(amountRemaining / daysRemaining);
                      return (
                        <li key={goal.id} className="p-3 bg-yellow-50 rounded-lg text-sm text-gray-700">
                          ⚠️ You're behind on "{goal.name}". To catch up, try saving ${dailySavingsNeeded} daily for the next {daysRemaining} days.
                        </li>
                      );
                    }
                    
                    if (pct >= 0.5 && pct < 1 && daysRemaining > 0) {
                      const dailySavingsNeeded = Math.round(amountRemaining / daysRemaining);
                      return (
                        <li key={goal.id} className="p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
                          🔄 You're halfway through "{goal.name}"! Stay consistent with savings of ${dailySavingsNeeded} per day to finish by {new Date(goal.deadline).toLocaleDateString()}.
                        </li>
                      );
                    }
                    
                    if (daysRemaining > 0) {
                      const dailySavingsNeeded = Math.round(amountRemaining / daysRemaining);
                      return (
                        <li key={goal.id} className="p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
                          📌 You're on track with "{goal.name}". Keep saving ${dailySavingsNeeded} per day to reach your goal on time.
                        </li>
                      );
                    }
                    
                    return null;
                  }).filter(Boolean)}
                </ul>
              ) : (
                <p className="text-center text-gray-500">Create some goals to see personalized recommendations.</p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default GoalsTracker;
