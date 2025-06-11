
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileImage, Loader2, CheckCircle, Camera, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFinancialDataDB } from "@/hooks/useFinancialDataDB";

interface ParsedReceiptData {
  merchant: string;
  amount: number;
  date: string;
  category: string;
  items: Array<{ name: string; price: number }>;
  confidence: number;
}

const EnhancedReceiptUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedReceiptData | null>(null);
  const [processingStage, setProcessingStage] = useState<string>("");
  const { toast } = useToast();
  const { handleAddTransaction } = useFinancialDataDB();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      setParsedData(null);
    }
  };

  const simulateAIParsing = async (): Promise<ParsedReceiptData> => {
    const stages = [
      "Analyzing image quality...",
      "Detecting text regions...",
      "Extracting merchant information...",
      "Identifying purchase items...",
      "Calculating totals...",
      "Categorizing transaction..."
    ];

    for (let i = 0; i < stages.length; i++) {
      setProcessingStage(stages[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Simulate parsed data
    return {
      merchant: "Whole Foods Market",
      amount: 87.42,
      date: new Date().toISOString().split('T')[0],
      category: "Groceries",
      items: [
        { name: "Organic Bananas", price: 3.99 },
        { name: "Almond Milk", price: 4.50 },
        { name: "Chicken Breast", price: 12.99 },
        { name: "Mixed Vegetables", price: 6.99 },
        { name: "Whole Grain Bread", price: 3.50 }
      ],
      confidence: 0.94
    };
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    
    try {
      const parsed = await simulateAIParsing();
      setParsedData(parsed);
      
      toast({
        title: "Receipt processed successfully!",
        description: `Found ${parsed.items.length} items from ${parsed.merchant}`,
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Please try again or enter the transaction manually",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setProcessingStage("");
    }
  };

  const handleAddParsedTransaction = async () => {
    if (!parsedData) return;

    const success = await handleAddTransaction(
      parsedData.category,
      parsedData.amount,
      "expense"
    );

    if (success) {
      toast({
        title: "Transaction added!",
        description: `Added $${parsedData.amount} expense from ${parsedData.merchant}`,
      });
      
      // Reset form
      setSelectedFile(null);
      setParsedData(null);
      const fileInput = document.getElementById('receipt-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Camera className="h-5 w-5 text-blue-600" />
            <Zap className="h-3 w-3 text-yellow-500" />
          </div>
          AI Receipt Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {!parsedData ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload a receipt for automatic extraction
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  AI will detect merchant, amount, items, and category
                </p>
                <Input
                  id="receipt-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('receipt-upload')?.click()}
                  disabled={isUploading}
                >
                  Select Receipt Image
                </Button>
              </div>
              
              {selectedFile && !isUploading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileImage className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{selectedFile.name}</span>
                  </div>
                  <Button
                    onClick={handleUpload}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Process with AI
                  </Button>
                </motion.div>
              )}

              {isUploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-4"
                >
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-blue-600 font-medium">{processingStage}</p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Receipt processed successfully!</span>
                <span className="text-sm bg-green-100 px-2 py-1 rounded">
                  {(parsedData.confidence * 100).toFixed(0)}% confidence
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Merchant</p>
                    <p className="font-medium">{parsedData.merchant}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Amount</p>
                    <p className="font-medium text-lg">${parsedData.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                    <p className="font-medium">{parsedData.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Category</p>
                    <p className="font-medium">{parsedData.category}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Items</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {parsedData.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>${item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAddParsedTransaction}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setParsedData(null);
                    setSelectedFile(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-xs text-gray-500 mt-4 pt-4 border-t">
          <p>• Supported: JPG, PNG, GIF (max 5MB)</p>
          <p>• AI extracts merchant, amount, items, and date</p>
          <p>• Review data before adding to transactions</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedReceiptUpload;
