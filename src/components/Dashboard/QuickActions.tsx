
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
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={action.onClick}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-3 w-full hover:shadow-md transition-all duration-200"
              >
                <div className={`p-3 rounded-full text-white ${action.color} transition-colors`}>
                  <action.icon size={20} />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{action.description}</div>
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
