
import React, { useState } from "react";
import { X, Upload, FileText, Loader2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTextExtraction } from "@/hooks/useTextExtraction";
import { Badge } from "@/components/ui/badge";

interface DocumentUploadProps {
  documentForm: {
    file: File | null;
    docType: string;
    note: string;
  };
  handleDocumentChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleDocumentUpload: () => void;
  documentTypes: string[];
  fileInputKey: number;
  onClose: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documentForm,
  handleDocumentChange,
  handleDocumentUpload,
  documentTypes,
  fileInputKey,
  onClose,
}) => {
  const [extractedText, setExtractedText] = useState<string>('');
  const [showExtractedText, setShowExtractedText] = useState(false);
  const { extractTextFromFile, isExtracting, extractionStage } = useTextExtraction();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    handleDocumentChange(e);
    // Reset extracted text when file changes
    setExtractedText('');
    setShowExtractedText(false);
  };

  const handleExtractText = async () => {
    if (!documentForm.file) return;

    const result = await extractTextFromFile(documentForm.file);
    if (result) {
      setExtractedText(result.extractedText.text);
      setShowExtractedText(true);
    }
  };

  const canExtractText = documentForm.file && (
    documentForm.file.type.startsWith('image/') || 
    documentForm.file.type === 'application/pdf'
  );

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Upload Document</h3>
        <Button 
          variant="ghost" 
          size="sm"  
          className="h-7 w-7 p-0"
          onClick={onClose}
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
            onChange={handleFileChange}
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
              onChange={handleFileChange}
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
              onChange={handleFileChange}
              placeholder="Add a note (optional)"
              className="text-xs"
            />
          </div>
        </div>

        {/* Text Extraction Section */}
        {canExtractText && (
          <div className="border-t pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">Text Extraction</span>
              {extractedText && (
                <Badge variant="secondary" className="text-xs">
                  Text Available
                </Badge>
              )}
            </div>
            
            {isExtracting ? (
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-xs text-blue-600">{extractionStage}</span>
              </div>
            ) : (
              <div className="flex gap-1">
                <Button
                  onClick={handleExtractText}
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 flex-1"
                  disabled={!documentForm.file}
                >
                  <FileText size={12} className="mr-1" />
                  Extract Text
                </Button>
                {extractedText && (
                  <Button
                    onClick={() => setShowExtractedText(!showExtractedText)}
                    size="sm"
                    variant="ghost"
                    className="text-xs h-7"
                  >
                    <Eye size={12} className="mr-1" />
                    {showExtractedText ? 'Hide' : 'View'}
                  </Button>
                )}
              </div>
            )}

            {showExtractedText && extractedText && (
              <div className="bg-white border rounded p-2 max-h-32 overflow-y-auto">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {extractedText}
                </pre>
              </div>
            )}
          </div>
        )}
        
        <Button 
          onClick={handleDocumentUpload} 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          size="sm"
          disabled={!documentForm.file}
        >
          <Upload size={16} className="mr-1" /> Upload Document
        </Button>
      </div>
    </div>
  );
};

export default DocumentUpload;
