
import React from "react";
import { motion } from "framer-motion";

interface HelpSectionProps {
  isVisible: boolean;
}

const HelpSection: React.FC<HelpSectionProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 bg-purple-50 text-purple-800 text-xs p-2 rounded-md"
    >
      <p className="font-medium">Quick Tips:</p>
      <ul className="list-disc list-inside">
        <li>Be specific with your questions</li>
        <li>Try the suggested prompts below</li>
        <li>Ask for explanations if answers aren't clear</li>
        <li>Upload documents for analysis</li>
        <li>Start a new chat for different topics</li>
      </ul>
    </motion.div>
  );
};

export default HelpSection;
