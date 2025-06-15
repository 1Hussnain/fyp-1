
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { FinancialGoal } from "@/types/database";

interface MotivationalTipsProps {
  goals: FinancialGoal[];
}

const MotivationalTips: React.FC<MotivationalTipsProps> = ({ goals }) => {
  const tips = [
    "Set specific, measurable goals with clear deadlines.",
    "Break large goals into smaller, manageable milestones.",
    "Track your progress regularly to stay motivated.",
    "Celebrate small wins along the way to your bigger goals.",
    "Review and adjust your goals as your situation changes."
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Daily Tip
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{randomTip}</p>
      </CardContent>
    </Card>
  );
};

export default MotivationalTips;
