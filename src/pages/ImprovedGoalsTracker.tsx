
import React from "react";
import { motion } from "framer-motion";
import AppLayout from "../components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OptimizedGoalsHeader from "../components/goals/OptimizedGoalsHeader";
import OptimizedGoalsTabs from "../components/goals/OptimizedGoalsTabs";
import OptimizedGoalsGrid from "../components/goals/OptimizedGoalsGrid";

const ImprovedGoalsTracker = () => {
  return (
    <AppLayout pageTitle="Goals Tracker">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Header Section */}
            <div className="text-center space-y-4 py-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Financial Goals Tracker
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Set, track, and achieve your financial milestones with our comprehensive goal management system.
              </p>
            </div>

            {/* Goals Header with Stats */}
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <OptimizedGoalsHeader />
              </CardContent>
            </Card>

            {/* Goals Management */}
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Manage Your Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <OptimizedGoalsTabs />
                
                <div className="mt-12">
                  <OptimizedGoalsGrid />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ImprovedGoalsTracker;
