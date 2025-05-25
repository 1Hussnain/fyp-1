
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, HelpCircle, FileText, Paperclip, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import ChatBubble from "../components/chat/ChatBubble";
import ChatInput from "../components/chat/ChatInput";
import SuggestedPrompts from "../components/chat/SuggestedPrompts";
import DocumentUpload from "../components/chat/DocumentUpload";
import DocumentList from "../components/chat/DocumentList";
import DocumentPreview from "../components/chat/DocumentPreview";
import HelpSection from "../components/chat/HelpSection";
import { useDocumentManagement } from "../hooks/useDocumentManagement";
import { Document } from "@/services/database";

// Document type options
const documentTypes = [
  "Bank Statement",
  "Invoice",
  "Bill",
  "Tax Document",
  "Receipt",
  "Other"
];

type MessageType = {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  messageType?: "tip" | "warning" | "suggestion" | "motivation";
  isDocument?: boolean;
  documentId?: string;
};

const FinanceChat = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "welcome-message",
      sender: "ai",
      text: "Hi! I'm your AI Financial Assistant 👋 Ask me anything about budgets, savings, or financial goals.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Handler for when a document is uploaded
  const handleDocumentUploaded = (newDoc: Document, userMessage: string) => {
    // Add document message to chat
    setMessages([
      ...messages,
      {
        id: crypto.randomUUID(),
        sender: "user",
        text: userMessage,
        timestamp: new Date(),
        isDocument: true,
        documentId: newDoc.id
      },
      {
        id: crypto.randomUUID(),
        sender: "ai",
        text: `I've received your ${newDoc.file_type?.toLowerCase() || 'document'}. If you have any questions about it, feel free to ask!`,
        timestamp: new Date()
      }
    ]);
  };
  
  // Use the document management hook
  const {
    documents,
    selectedDoc,
    showDocumentUpload,
    showDocumentList,
    fileInputKey,
    documentForm,
    setShowDocumentList,
    setShowDocumentUpload,
    handleDocumentChange,
    handleDocumentUpload: uploadDocument,
    deleteDocument: deleteDocumentHandler,
    openPreview,
    closePreview
  } = useDocumentManagement(handleDocumentUploaded);

  const handleDocumentUpload = () => {
    uploadDocument();
  };

  const deleteDocument = (id: string) => {
    const success = deleteDocumentHandler(id);
    if (success) {
      // Remove document messages from chat
      const updatedMessages = messages.filter(msg => 
        !(msg.isDocument && msg.documentId === id)
      );
      
      setMessages(updatedMessages);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { 
      id: crypto.randomUUID(),
      sender: "user", 
      text: input.trim(),
      timestamp: new Date()
    };
    
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
  
  const clearChat = () => {
    setMessages([
      {
        id: crypto.randomUUID(),
        sender: "ai",
        text: "New conversation started. How can I help with your finances today?",
        timestamp: new Date(),
      },
    ]);
  };

  const simulateAIResponse = (query: string) => {
    const lowercase = query.toLowerCase();
    let response: { text: string; type?: "tip" | "warning" | "suggestion" | "motivation" } = 
      { text: "I'm still learning about finance. Could you clarify your question?" };

    // Analyze the query to determine the response and type
    if (lowercase.includes("save") || lowercase.includes("saving")) {
      response = { 
        text: "The 50/30/20 rule is a great starting point: 50% for needs, 30% for wants, and 20% for savings. Try automating transfers to your savings account on payday.",
        type: "tip" 
      };
    } else if (lowercase.includes("budget") || lowercase.includes("spending")) {
      response = {
        text: "Track your expenses for a month to understand your spending patterns. I recommend categorizing them into fixed costs, variable expenses, and discretionary spending.",
        type: "suggestion"
      };
    } else if (lowercase.includes("debt") || lowercase.includes("loan")) {
      response = {
        text: "High-interest debts like credit cards should be paid first. Focus on the debt avalanche method: pay minimums on all debts, then put extra money toward the highest-interest debt.",
        type: "warning"
      };
    } else if (lowercase.includes("goal") || lowercase.includes("plan")) {
      response = {
        text: "Setting SMART financial goals is key to success. Make them Specific, Measurable, Achievable, Relevant, and Time-bound. Would you like to set one today?",
        type: "motivation"
      };
    } else if (lowercase.includes("invest") || lowercase.includes("return")) {
      response = {
        text: "For beginners, index funds offer diversification with lower risk than individual stocks. Remember that investments should align with your risk tolerance and time horizon.",
        type: "suggestion"
      };
    } else if (lowercase.includes("emergency") || lowercase.includes("fund")) {
      response = {
        text: "An emergency fund should cover 3-6 months of essential expenses. Keep it in a high-yield savings account for easy access while earning some interest.",
        type: "tip"
      };
    } else if (lowercase.includes("document") || lowercase.includes("upload")) {
      response = {
        text: "You can upload financial documents by clicking the paperclip icon at the bottom of the chat. I can help you analyze and organize them.",
        type: "tip"
      };
    }

    // Simulate thinking time based on query complexity
    const responseDelay = 1000 + (query.length * 10);
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev, 
        { 
          id: crypto.randomUUID(),
          sender: "ai", 
          text: response.text,
          timestamp: new Date(),
          messageType: response.type
        }
      ]);
    }, responseDelay);
  };

  return (
    <div className="container px-4 py-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col h-[80vh] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative"
      >
        <CardHeader className="border-b bg-gray-50 px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-purple-600" />
                <span>Financial Assistant</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Ask about budgets, investments, savings goals, or debt management
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDocumentList(!showDocumentList)}
                className="text-gray-500 flex items-center gap-1"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Documents</span>
                {documents.length > 0 && (
                  <Badge className="ml-1 bg-purple-100 text-purple-800">{documents.length}</Badge>
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowHelp(!showHelp)}
                className="text-gray-500"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <HelpSection isVisible={showHelp} />
          
          {/* Document List Dropdown */}
          {showDocumentList && (
            <DocumentList 
              documents={documents} 
              onClose={() => setShowDocumentList(false)}
              onPreview={openPreview}
              onDelete={deleteDocument}
            />
          )}
        </CardHeader>
        
        <ScrollArea className="flex-1 p-4" ref={chatContainerRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} msg={msg} />
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-300 p-3 rounded-xl text-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Document Upload Form */}
        {showDocumentUpload && (
          <DocumentUpload
            documentForm={documentForm}
            handleDocumentChange={handleDocumentChange}
            handleDocumentUpload={handleDocumentUpload}
            documentTypes={documentTypes}
            fileInputKey={fileInputKey}
            onClose={() => setShowDocumentUpload(false)}
          />
        )}
        
        <CardFooter className="flex flex-col border-t bg-gray-50 p-4">
          <SuggestedPrompts onSelectPrompt={handleQuickPrompt} />
          
          <div className="flex items-center w-full gap-2">
            <ChatInput 
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              isTyping={isTyping}
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowDocumentUpload(!showDocumentUpload)} 
              className={`shrink-0 ${showDocumentUpload ? 'bg-purple-100 text-purple-600 border-purple-300' : ''}`}
              disabled={isTyping}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearChat} 
              className="shrink-0 text-xs"
              disabled={isTyping || messages.length <= 1}
            >
              Clear Chat
            </Button>
          </div>
        </CardFooter>
      </motion.div>
      
      {/* Document Preview Modal */}
      {selectedDoc && (
        <DocumentPreview
          document={selectedDoc}
          onClose={closePreview}
          onDelete={deleteDocument}
        />
      )}
    </div>
  );
};

export default FinanceChat;
