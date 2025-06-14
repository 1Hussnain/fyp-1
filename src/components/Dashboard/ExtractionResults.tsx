
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Eye } from "lucide-react";
import ParsedReceiptData from "./ParsedReceiptData";

interface ExtractionResultsProps {
  extractionResult: {
    extractedText: {
      text: string;
      confidence: number;
      metadata?: {
        processingTime?: number;
        language?: string;
      };
    };
    parsedReceipt?: {
      merchant: string;
      amount: number;
      date: string;
      category: string;
      items: Array<{ name: string; price: number }>;
    };
  };
  showRawText: boolean;
  onToggleRawText: () => void;
  onAddTransaction: () => void;
  onReset: () => void;
}

const ExtractionResults: React.FC<ExtractionResultsProps> = ({
  extractionResult,
  showRawText,
  onToggleRawText,
  onAddTransaction,
  onReset,
}) => {
  return (
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
        <ParsedReceiptData parsedReceipt={extractionResult.parsedReceipt} />
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-800">Extracted Text</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleRawText}
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
            onClick={onAddTransaction}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        )}
        <Button
          variant="outline"
          onClick={onReset}
        >
          Process Another
        </Button>
      </div>
    </motion.div>
  );
};

export default ExtractionResults;
