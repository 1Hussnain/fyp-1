
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileImage, Loader2, CheckCircle, Camera, Zap, FileText, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFinancialDataDB } from "@/hooks/useFinancialDataDB";
import { useTextExtraction } from "@/hooks/useTextExtraction";

const EnhancedReceiptUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractionResult, setExtractionResult] = useState<any>(null);
  const [showRawText, setShowRawText] = useState(false);
  const { toast } = useToast();
  const { handleAddTransaction } = useFinancialDataDB();
  const { extractTextFromFile, isExtracting, extractionStage } = useTextExtraction();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPG, PNG, etc.) or PDF",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      setExtractionResult(null);
      setShowRawText(false);
    }
  };

  const handleExtractText = async () => {
    if (!selectedFile) return;

    const result = await extractTextFromFile(selectedFile);
    if (result) {
      setExtractionResult(result);
    }
  };

  const handleAddParsedTransaction = async () => {
    if (!extractionResult?.parsedReceipt) return;

    const { parsedReceipt } = extractionResult;
    const success = await handleAddTransaction(
      parsedReceipt.category,
      parsedReceipt.amount,
      "expense"
    );

    if (success) {
      toast({
        title: "Transaction added!",
        description: `Added $${parsedReceipt.amount} expense from ${parsedReceipt.merchant}`,
      });
      
      // Reset form
      setSelectedFile(null);
      setExtractionResult(null);
      setShowRawText(false);
      const fileInput = document.getElementById('receipt-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setExtractionResult(null);
    setShowRawText(false);
    const fileInput = document.getElementById('receipt-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Camera className="h-5 w-5 text-blue-600" />
            <Zap className="h-3 w-3 text-yellow-500" />
          </div>
          Receipt & Document Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {!extractionResult ? (
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
                  Upload receipt, invoice, or document for text extraction
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Advanced OCR will extract text and identify transaction details
                </p>
                <Input
                  id="receipt-upload"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('receipt-upload')?.click()}
                  disabled={isExtracting}
                >
                  Select File
                </Button>
              </div>
              
              {selectedFile && !isExtracting && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {selectedFile.type.startsWith('image/') ? (
                      <FileImage className="h-4 w-4 text-gray-500" />
                    ) : (
                      <FileText className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="text-sm text-gray-700">{selectedFile.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)
                    </span>
                  </div>
                  <Button
                    onClick={handleExtractText}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Extract Text
                  </Button>
                </motion.div>
              )}

              {isExtracting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6"
                >
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-blue-600 font-medium">{extractionStage}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
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
                <span className="font-medium">Text extracted successfully!</span>
                <span className="text-sm bg-green-100 px-2 py-1 rounded">
                  {(extractionResult.extractedText.confidence * 100).toFixed(0)}% confidence
                </span>
              </div>

              {extractionResult.parsedReceipt && (
                <div className="bg-blue-50 rounded-lg p-4 space-y-3 border border-blue-200">
                  <h3 className="font-medium text-blue-800">Receipt Data Detected</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-blue-600 uppercase tracking-wide">Merchant</p>
                      <p className="font-medium">{extractionResult.parsedReceipt.merchant}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 uppercase tracking-wide">Amount</p>
                      <p className="font-medium text-lg">${extractionResult.parsedReceipt.amount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 uppercase tracking-wide">Date</p>
                      <p className="font-medium">{extractionResult.parsedReceipt.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 uppercase tracking-wide">Category</p>
                      <p className="font-medium">{extractionResult.parsedReceipt.category}</p>
                    </div>
                  </div>

                  {extractionResult.parsedReceipt.items.length > 0 && (
                    <div>
                      <p className="text-xs text-blue-600 uppercase tracking-wide mb-2">Items</p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {extractionResult.parsedReceipt.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.name}</span>
                            <span>${item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-800">Extracted Text</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRawText(!showRawText)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {showRawText ? 'Hide' : 'Show'}
                  </Button>
                </div>
                
                {showRawText && (
                  <div className="bg-white border rounded p-3 max-h-40 overflow-y-auto">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {extractionResult.extractedText.text}
                    </pre>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mt-2">
                  Processing time: {extractionResult.extractedText.metadata?.processingTime}ms
                  {extractionResult.extractedText.metadata?.language && 
                    ` • Language: ${extractionResult.extractedText.metadata.language}`
                  }
                </div>
              </div>

              <div className="flex gap-2">
                {extractionResult.parsedReceipt && (
                  <Button
                    onClick={handleAddParsedTransaction}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Add Transaction
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={resetForm}
                >
                  Process Another
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-xs text-gray-500 mt-4 pt-4 border-t">
          <p>• Supported: JPG, PNG, GIF, PDF (max 10MB)</p>
          <p>• OCR extracts text from images and PDFs</p>
          <p>• Automatically detects receipt data for transactions</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedReceiptUpload;
