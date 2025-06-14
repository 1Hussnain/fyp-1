
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFinancialDataDB } from "@/hooks/useFinancialDataDB";
import { useTextExtraction } from "@/hooks/useTextExtraction";
import FileUploadSection from "./FileUploadSection";
import ExtractionResults from "./ExtractionResults";

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
    const success = await handleAddTransaction({
      type: "expense",
      category_id: null,
      amount: parsedReceipt.amount,
      description: `Receipt from ${parsedReceipt.merchant}`,
      date: new Date().toISOString().split('T')[0]
    });

    if (success) {
      toast({
        title: "Transaction added!",
        description: `Added $${parsedReceipt.amount} expense from ${parsedReceipt.merchant}`,
      });
      
      resetForm();
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
            <FileUploadSection
              selectedFile={selectedFile}
              isExtracting={isExtracting}
              extractionStage={extractionStage}
              onFileSelect={handleFileSelect}
              onExtractText={handleExtractText}
            />
          ) : (
            <ExtractionResults
              extractionResult={extractionResult}
              showRawText={showRawText}
              onToggleRawText={() => setShowRawText(!showRawText)}
              onAddTransaction={handleAddParsedTransaction}
              onReset={resetForm}
            />
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
