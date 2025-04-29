
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ChatBubbleProps {
  msg: {
    sender: string;
    text: string;
    messageType?: "tip" | "warning" | "suggestion" | "motivation";
  };
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ msg }) => {
  const isUser = msg.sender === "user";
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Determine message icon and styling based on type
  const renderMessageIcon = () => {
    if (isUser) return null;
    
    switch (msg.messageType) {
      case "tip":
        return <span className="mr-1">💡</span>;
      case "warning":
        return <span className="mr-1">⚠️</span>;
      case "suggestion":
        return <span className="mr-1">📈</span>;
      case "motivation":
        return <span className="mr-1">✅</span>;
      default:
        return null;
    }
  };
  
  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col">
        <div
          className={`p-3 rounded-xl text-sm shadow ${
            isUser
              ? "bg-purple-600 text-white"
              : "bg-white border border-gray-300 text-left"
          } max-w-[300px] sm:max-w-[400px]`}
        >
          <div className="flex items-start">
            {renderMessageIcon()}
            <span>{msg.text}</span>
          </div>
        </div>
        <span className={`text-xs text-gray-400 mt-1 ${isUser ? "text-right" : "text-left"}`}>
          {timestamp}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
