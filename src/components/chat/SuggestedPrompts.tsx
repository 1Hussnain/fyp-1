
import React from "react";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ onSelectPrompt }) => {
  const prompts = [
    "Suggest a savings plan",
    "Build me a monthly budget",
    "How much can I invest?",
    "Review my goals",
    "Emergency fund advice"
  ];

  return (
    <div className="flex gap-2 my-3 flex-wrap">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelectPrompt(prompt)}
          className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs hover:bg-indigo-200 transition-colors"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};

export default SuggestedPrompts;
