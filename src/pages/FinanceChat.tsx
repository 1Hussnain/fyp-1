
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ChatBubble from "../components/chat/ChatBubble";
import ChatInput from "../components/chat/ChatInput";
import SuggestedPrompts from "../components/chat/SuggestedPrompts";

const FinanceChat = () => {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi! I'm FinBuddy 👋 Ask me anything about your money." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { sender: "user", text: input.trim() };
    setMessages([...messages, newMsg]);
    setInput("");
    
    setIsTyping(true);
    simulateAIResponse(input.trim());
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    // Use setTimeout to ensure the input is set before submitting
    setTimeout(() => {
      handleSend({ preventDefault: () => {} } as React.FormEvent);
    }, 10);
  };

  const simulateAIResponse = (query: string) => {
    const lowercase = query.toLowerCase();
    let response = "";

    if (lowercase.includes("save") || lowercase.includes("spending")) {
      response = "You can start by saving 20% of your income. Let's create a budget together. 🎯";
    } else if (lowercase.includes("budget")) {
      response = "Sure! What's your monthly income and average expenses? With that information, I can help you build a solid monthly budget.";
    } else if (lowercase.includes("goal")) {
      response = "You're doing great! You've already saved 65% towards your travel goal 🌍. Keep up the good work!";
    } else if (lowercase.includes("invest")) {
      response = "Consider starting with mutual funds or ETFs if you're new to investing 📈. These provide diversification and lower risk compared to individual stocks.";
    } else if (lowercase.includes("debt") || lowercase.includes("loan")) {
      response = "Focus on paying high-interest debt first, like credit cards. Then move to lower interest loans like student debt or mortgages. Want to create a debt payment plan?";
    } else if (lowercase.includes("emergency fund")) {
      response = "An emergency fund should cover 3-6 months of essential expenses. Based on your profile, I'd recommend aiming for about $12,000.";
    } else {
      response = "Let me look into that… Could you give me a bit more detail about your financial situation?";
    }

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { sender: "ai", text: response }]);
    }, 1500); // Simulate thinking time
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto p-4 h-[90vh] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Finance Assistant</h2>
      
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-inner"
      >
        {messages.map((msg, index) => (
          <ChatBubble key={index} msg={msg} />
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-300 p-3 rounded-xl text-sm max-w-[70%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <SuggestedPrompts onSelectPrompt={handleQuickPrompt} />
      
      <ChatInput 
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        isTyping={isTyping}
      />
    </motion.div>
  );
};

export default FinanceChat;
