
import React, { useState } from "react";
import { Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSend: (e: React.FormEvent) => void;
  isTyping: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, handleSend, isTyping }) => {
  const [isRecording, setIsRecording] = useState(false);

  const handleVoice = () => {
    // This is just a placeholder for future voice functionality
    setIsRecording(!isRecording);
    setTimeout(() => {
      setIsRecording(false);
    }, 2000);
  };
  
  return (
    <form onSubmit={handleSend} className="flex items-center gap-2 mt-4">
      <div className="relative flex-1">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your finances..."
          className="pr-10 bg-gray-50 border-gray-300 focus:border-purple-400 focus:ring-purple-300"
          disabled={isTyping || isRecording}
        />
        {isRecording && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
      
      <Button 
        type="button"
        variant="outline"
        size="icon"
        onClick={handleVoice}
        className={isRecording ? "bg-red-100 text-red-500 border-red-300" : ""}
        disabled={isTyping}
      >
        <Mic className="h-4 w-4" />
      </Button>
      
      <Button 
        type="submit" 
        variant={isTyping || !input.trim() ? "secondary" : "default"}
        className={`${!input.trim() ? "opacity-70" : ""}`}
        disabled={isTyping || !input.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;
