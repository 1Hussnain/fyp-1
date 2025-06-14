
import { useState } from 'react';
import { textExtractionService, ExtractedTextData, ReceiptData } from '@/services/textExtraction';
import { toast } from '@/components/ui/sonner';

export interface ExtractionResult {
  extractedText: ExtractedTextData;
  parsedReceipt?: ReceiptData;
}

export const useTextExtraction = () => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionStage, setExtractionStage] = useState<string>('');

  const extractTextFromFile = async (file: File): Promise<ExtractionResult | null> => {
    setIsExtracting(true);
    setExtractionStage('Analyzing file...');

    try {
      let extractedText: ExtractedTextData;

      if (file.type.startsWith('image/')) {
        setExtractionStage('Processing image with OCR...');
        extractedText = await textExtractionService.extractTextFromImage(file);
      } else if (file.type === 'application/pdf') {
        setExtractionStage('Extracting text from PDF...');
        extractedText = await textExtractionService.extractTextFromPDF(file);
      } else {
        throw new Error('Unsupported file type for text extraction');
      }

      setExtractionStage('Parsing document content...');
      
      // If it looks like a receipt, parse it
      let parsedReceipt: ReceiptData | undefined;
      if (extractedText.text.toLowerCase().includes('total') || 
          extractedText.text.includes('$') ||
          extractedText.text.toLowerCase().includes('receipt')) {
        parsedReceipt = textExtractionService.parseReceiptData(extractedText.text);
      }

      setExtractionStage('Finalizing results...');
      
      toast.success(`Text extracted successfully! (${(extractedText.confidence * 100).toFixed(0)}% confidence)`);
      
      return {
        extractedText,
        parsedReceipt
      };

    } catch (error) {
      console.error('Text extraction failed:', error);
      toast.error('Failed to extract text from file');
      return null;
    } finally {
      setIsExtracting(false);
      setExtractionStage('');
    }
  };

  return {
    extractTextFromFile,
    isExtracting,
    extractionStage
  };
};
