
import React from "react";
import { motion } from "framer-motion";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ onSelectPrompt }) => {
  const prompts = [
    { text: "Create a savings plan", icon: "💰" },
    { text: "Build me a monthly budget", icon: "📊" },
    { text: "Analyze my spending", icon: "📈" },
    { text: "Set financial goals", icon: "🎯" },
    { text: "Emergency fund advice", icon: "🚨" }
  ];

  return (
    <div className="my-3">
      <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
      <div className="flex gap-2 flex-wrap">
        {prompts.map((prompt) => (
          <motion.button
            key={prompt.text}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectPrompt(prompt.text)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-xs flex items-center gap-1 transition-colors"
          >
            <span>{prompt.icon}</span>
            <span>{prompt.text}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedPrompts;
