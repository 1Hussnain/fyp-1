
import { useState } from 'react';
import { textExtractionService, ExtractedTextData, ReceiptData } from '@/services/textExtraction';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';
import { toast } from '@/components/ui/sonner';

export interface ExtractionResult {
  extractedText: ExtractedTextData;
  parsedReceipt?: ReceiptData;
}

export const useTextExtraction = () => {
  const [extractionStage, setExtractionStage] = useState<string>('');
  const { execute, loading: isExtracting } = useAsyncOperation<ExtractionResult>();

  const extractTextFromFile = async (file: File): Promise<ExtractionResult | null> => {
    return execute(
      async () => {
        setExtractionStage('Analyzing file...');

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
        
        return {
          extractedText,
          parsedReceipt
        };
      },
      {
        onSuccess: (result) => {
          toast.success(`Text extracted successfully! (${(result.extractedText.confidence * 100).toFixed(0)}% confidence)`);
          setExtractionStage('');
        },
        onError: () => {
          setExtractionStage('');
        }
      }
    );
  };

  return {
    extractTextFromFile,
    isExtracting,
    extractionStage
  };
};
