
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Upload, Target, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Plus,
      label: "Add Transaction",
      description: "Record income or expense",
      onClick: () => navigate("/financial-management"),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: Target,
      label: "Set Goal",
      description: "Create a savings goal",
      onClick: () => navigate("/goals-tracker"),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: Upload,
      label: "Import Data",
      description: "Upload CSV transactions",
      onClick: () => navigate("/financial-management"),
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      icon: FileText,
      label: "View Reports",
      description: "Analyze your spending",
      onClick: () => navigate("/budget-summary"),
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4 sm:mb-6 text-gray-800">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {actions.map((action, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={action.onClick}
                variant="outline"
                className="h-24 sm:h-28 p-3 sm:p-4 flex flex-col items-center gap-2 sm:gap-3 w-full hover:shadow-md transition-all duration-200 border-gray-200 hover:border-gray-300"
              >
                <div className={`p-2 sm:p-3 rounded-full text-white ${action.color} transition-colors shadow-sm`}>
                  <action.icon size={16} className="sm:w-5 sm:h-5" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-xs sm:text-sm text-gray-800">{action.label}</div>
                  <div className="text-xs text-gray-500 mt-1 hidden sm:block">{action.description}</div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
