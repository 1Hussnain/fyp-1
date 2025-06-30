
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target, AlertCircle } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const GoalsTracker = () => {
  const { goals, loading, error, updateGoal, deleteGoal } = useGoals();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your goals..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Error Loading Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeGoals = goals.filter(goal => !goal.is_completed);
  const completedGoals = goals.filter(goal => goal.is_completed);

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Goals</h1>
          <p className="text-gray-600 mt-2">
            Track your progress towards financial freedom
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold">{activeGoals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{completedGoals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Goals</p>
                <p className="text-2xl font-bold">{goals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {goals.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Goals Yet</h3>
            <p className="text-gray-600 mb-6">
              Start your financial journey by creating your first goal!
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {activeGoals.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Active Goals</h2>
              <div className="grid gap-4">
                {activeGoals.map((goal) => (
                  <Card key={goal.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{goal.name}</h3>
                          {goal.description && (
                            <p className="text-gray-600 mt-1">{goal.description}</p>
                          )}
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span>
                                ${Number(goal.saved_amount).toFixed(2)} / ${Number(goal.target_amount).toFixed(2)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ 
                                  width: `${Math.min((Number(goal.saved_amount) / Number(goal.target_amount)) * 100, 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                              {Math.round((Number(goal.saved_amount) / Number(goal.target_amount)) * 100)}% complete
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {completedGoals.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Completed Goals</h2>
              <div className="grid gap-4">
                {completedGoals.map((goal) => (
                  <Card key={goal.id} className="opacity-75">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{goal.name}</h3>
                          {goal.description && (
                            <p className="text-gray-600 mt-1">{goal.description}</p>
                          )}
                          <p className="text-green-600 font-medium mt-2">✓ Completed</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalsTracker;
