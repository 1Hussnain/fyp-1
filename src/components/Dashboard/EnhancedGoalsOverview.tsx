
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Calendar, DollarSign } from "lucide-react";
import { useGoalsDB } from "@/hooks/useGoalsDB";
import { useNavigate } from "react-router-dom";

const EnhancedGoalsOverview = () => {
  const { goals } = useGoalsDB();
  const navigate = useNavigate();

  const activeGoals = goals.filter(goal => (goal.saved / goal.target) * 100 < 100).slice(0, 4);

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goals Progress
          </CardTitle>
          <button 
            onClick={() => navigate("/goals-tracker")}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View All →
          </button>
        </CardHeader>
        <CardContent>
          {activeGoals.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No active goals yet</p>
              <button 
                onClick={() => navigate("/goals-tracker")}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Create your first goal →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeGoals.map((goal) => {
                const progress = (goal.saved / goal.target) * 100;
                const daysRemaining = getDaysRemaining(goal.deadline);
                
                return (
                  <motion.div 
                    key={goal.id} 
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{goal.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${goal.saved.toLocaleString()} / ${goal.target.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {daysRemaining > 0 ? `${daysRemaining} days left` : 
                             daysRemaining === 0 ? 'Due today' : 'Overdue'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold">{progress.toFixed(1)}%</span>
                        <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                          daysRemaining < 0 ? 'bg-red-100 text-red-600' :
                          daysRemaining < 30 ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {daysRemaining < 0 ? 'Overdue' :
                           daysRemaining < 30 ? 'Due soon' : 'On track'}
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={Math.min(progress, 100)} 
                      className="h-3"
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnhancedGoalsOverview;
