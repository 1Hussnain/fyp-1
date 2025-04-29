
import React from "react";
import { motion } from "framer-motion";

interface ChatBubbleProps {
  msg: {
    sender: string;
    text: string;
  };
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ msg }) => {
  const isUser = msg.sender === "user";
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
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
              ? "bg-indigo-100 text-right"
              : "bg-white border border-gray-300 text-left"
          } max-w-[300px] sm:max-w-[400px]`}
        >
          {msg.text}
        </div>
        <span className={`text-xs text-gray-400 mt-1 ${isUser ? "text-right" : "text-left"}`}>
          {timestamp}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
