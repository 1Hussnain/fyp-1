
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, HelpCircle, FileText, FileImage, Download, Trash2, X, Eye, Upload, Paperclip } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import ChatBubble from "../components/chat/ChatBubble";
import ChatInput from "../components/chat/ChatInput";
import SuggestedPrompts from "../components/chat/SuggestedPrompts";

type MessageType = {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  messageType?: "tip" | "warning" | "suggestion" | "motivation";
  isDocument?: boolean;
  documentId?: number;
};

interface Document {
  id: number;
  fileName: string;
  type: string;
  note: string;
  uploadedAt: string;
  preview: string;
  url: string;
  fileType: "pdf" | "image" | "other";
}

// Document type options
const documentTypes = [
  "Bank Statement",
  "Invoice",
  "Bill",
  "Tax Document",
  "Receipt",
  "Other"
];

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
  
  // Document management state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showDocumentList, setShowDocumentList] = useState(false);
  const [fileInputKey, setFileInputKey] = useState<number>(0);
  const [documentForm, setDocumentForm] = useState({
    file: null as File | null,
    docType: "Bank Statement",
    note: "",
  });

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

  // Handle document input changes
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.target.name === "file" && e.target instanceof HTMLInputElement && e.target.files?.[0]) {
      setDocumentForm({ ...documentForm, file: e.target.files[0] });
    } else {
      setDocumentForm({ ...documentForm, [e.target.name]: e.target.value });
    }
  };

  // Determine file type icon
  const getFileTypeInfo = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      return { type: "pdf", icon: <FileText className="text-red-500" /> };
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
      return { type: "image", icon: <FileImage className="text-blue-500" /> };
    }
    return { type: "other", icon: <FileText className="text-gray-500" /> };
  };

  // Handle document upload
  const handleDocumentUpload = () => {
    if (!documentForm.file) {
      toast.error("Please select a file");
      return;
    }

    // Get file type info
    const { type: fileType } = getFileTypeInfo(documentForm.file.name);

    // Create new document
    const newDoc: Document = {
      id: Date.now(),
      fileName: documentForm.file.name,
      type: documentForm.docType,
      note: documentForm.note,
      uploadedAt: new Date().toLocaleDateString(),
      preview: documentForm.note || "This document contains financial information that has been automatically processed. Click 'View' to see more details.",
      url: URL.createObjectURL(documentForm.file),
      fileType: fileType as "pdf" | "image" | "other",
    };

    // Add to documents array
    setDocuments([newDoc, ...documents]);
    
    // Add document message to chat
    setMessages([
      ...messages,
      {
        id: crypto.randomUUID(),
        sender: "user",
        text: `Uploaded document: ${documentForm.file.name}`,
        timestamp: new Date(),
        isDocument: true,
        documentId: newDoc.id
      },
      {
        id: crypto.randomUUID(),
        sender: "ai",
        text: `I've received your ${documentForm.docType.toLowerCase()}. If you have any questions about it, feel free to ask!`,
        timestamp: new Date()
      }
    ]);
    
    // Reset form
    setDocumentForm({ file: null, docType: "Bank Statement", note: "" });
    setFileInputKey(prev => prev + 1);
    setShowDocumentUpload(false);
    toast.success("Document uploaded successfully");
  };

  // Delete document
  const deleteDocument = (id: number) => {
    if (confirm("Are you sure you want to delete this document?")) {
      const updated = documents.filter((doc) => doc.id !== id);
      setDocuments(updated);
      
      // If deleted document was selected in preview, close preview
      if (selectedDoc?.id === id) {
        setSelectedDoc(null);
      }
      
      // Remove document messages from chat
      const updatedMessages = messages.filter(msg => 
        !(msg.isDocument && msg.documentId === id)
      );
      
      setMessages(updatedMessages);
      
      toast.success("Document deleted");
    }
  };

  // Open and close preview
  const openPreview = (doc: Document) => setSelectedDoc(doc);
  const closePreview = () => setSelectedDoc(null);

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
          
          {showHelp && (
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
          )}
          
          {/* Document List Dropdown */}
          {showDocumentList && documents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 bg-white border rounded-md shadow-md p-2 max-h-[250px] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-2 p-1">
                <h3 className="font-medium text-sm">Your Documents</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs" 
                  onClick={() => setShowDocumentList(false)}
                >
                  <X size={14} />
                </Button>
              </div>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center gap-2">
                      {getFileTypeInfo(doc.fileName).icon}
                      <span className="text-sm font-medium truncate max-w-[150px]">{doc.fileName}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0" 
                        onClick={() => openPreview(doc)}
                      >
                        <Eye size={14} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 text-red-500" 
                        onClick={() => deleteDocument(doc.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
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
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 bg-gray-50 p-3"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">Upload Document</h3>
              <Button 
                variant="ghost" 
                size="sm"  
                className="h-7 w-7 p-0"
                onClick={() => setShowDocumentUpload(false)}
              >
                <X size={16} />
              </Button>
            </div>
            <div className="grid gap-3">
              <div>
                <Input
                  id="file"
                  key={fileInputKey}
                  type="file"
                  name="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.csv"
                  onChange={handleDocumentChange}
                  className="text-xs cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max size: 5MB. Accepted: PDF, images, office docs
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <select
                    id="docType"
                    name="docType"
                    value={documentForm.docType}
                    onChange={handleDocumentChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {documentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Input
                    id="note"
                    name="note"
                    value={documentForm.note}
                    onChange={handleDocumentChange}
                    placeholder="Add a note (optional)"
                    className="text-xs"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleDocumentUpload} 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                size="sm"
                disabled={!documentForm.file}
              >
                <Upload size={16} className="mr-1" /> Upload Document
              </Button>
            </div>
          </motion.div>
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
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePreview}
        >
          <motion.div
            className="w-full md:w-1/3 bg-white h-full overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedDoc.fileName}</h2>
                <Button variant="ghost" size="icon" onClick={closePreview}>
                  <X size={20} />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Type: {selectedDoc.type}</p>
                  <p className="text-sm text-gray-500">Uploaded: {selectedDoc.uploadedAt}</p>
                </div>
                
                {selectedDoc.fileType === "image" && (
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={selectedDoc.url}
                      alt={selectedDoc.fileName}
                      className="w-full h-auto"
                    />
                  </div>
                )}
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-medium mb-2">Document Content</h3>
                  <p className="text-sm">{selectedDoc.preview}</p>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <a
                    href={selectedDoc.url}
                    download={selectedDoc.fileName}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
                  >
                    <Download size={16} /> Download
                  </a>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => {
                      deleteDocument(selectedDoc.id);
                      closePreview();
                    }}
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default FinanceChat;
