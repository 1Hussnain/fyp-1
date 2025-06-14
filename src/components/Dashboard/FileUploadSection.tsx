
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileImage, Loader2, FileText, Zap } from "lucide-react";

interface FileUploadSectionProps {
  selectedFile: File | null;
  isExtracting: boolean;
  extractionStage: string;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExtractText: () => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  selectedFile,
  isExtracting,
  extractionStage,
  onFileSelect,
  onExtractText,
}) => {
  return (
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
          onChange={onFileSelect}
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
            onClick={onExtractText}
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
  );
};

export default FileUploadSection;
