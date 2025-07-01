
import React, { useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "../components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatBubble from "../components/chat/ChatBubble";
import ChatInput from "../components/chat/ChatInput";
import SuggestedPrompts from "../components/chat/SuggestedPrompts";
import DocumentList from "../components/chat/DocumentList";
import HelpSection from "../components/chat/HelpSection";
import { useChatWithDatabase } from "@/hooks/useChatWithDatabase";
import { Loader2, MessageCircle } from "lucide-react";

const FinanceChat = () => {
  const { messages, loading, sendMessage } = useChatWithDatabase();
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (input.trim()) {
      await sendMessage(input);
      setInput("");
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <AppLayout pageTitle="Finance Chat">
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-100 dark:from-gray-900 dark:to-indigo-900">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center py-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                AI Financial Assistant
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Get personalized financial advice and insights
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Chat Section */}
              <div className="xl:col-span-3">
                <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-[calc(100vh-300px)]">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                      <MessageCircle className="h-5 w-5" />
                      Chat with Your Financial Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col h-full p-0">
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center py-12">
                          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Start a conversation
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            Ask me anything about your finances, budgeting, or financial goals
                          </p>
                        </div>
                      ) : (
                        messages.map((message, index) => (
                          <ChatBubble key={index} message={message} />
                        ))
                      )}
                      {loading && (
                        <div className="flex justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="border-t dark:border-gray-700 p-4">
                      <ChatInput
                        value={input}
                        onChange={setInput}
                        onSend={handleSendMessage}
                        loading={loading}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="xl:col-span-1 space-y-6">
                {/* Suggested Prompts */}
                <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Suggested Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SuggestedPrompts onSelect={handleSuggestedPrompt} />
                  </CardContent>
                </Card>

                {/* Recent Documents */}
                <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Recent Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DocumentList />
                  </CardContent>
                </Card>

                {/* Help Section */}
                <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Help & Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HelpSection />
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default FinanceChat;
