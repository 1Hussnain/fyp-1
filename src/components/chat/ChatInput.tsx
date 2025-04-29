
import React from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSend: (e: React.FormEvent) => void;
  isTyping: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, handleSend, isTyping }) => {
  return (
    <form onSubmit={handleSend} className="flex items-center mt-4 space-x-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me about your savings or goals..."
        className="flex-1 border rounded-xl p-3 text-sm shadow focus:ring-2 focus:ring-indigo-300 focus:outline-none"
        disabled={isTyping}
      />
      <button 
        type="submit" 
        className={`${
          isTyping || !input.trim() 
            ? "bg-indigo-400 cursor-not-allowed" 
            : "bg-indigo-600 hover:bg-indigo-700"
        } text-white px-4 py-2 rounded-xl transition-colors flex items-center justify-center`}
        disabled={isTyping || !input.trim()}
      >
        <Send size={18} />
      </button>
    </form>
  );
};

export default ChatInput;
