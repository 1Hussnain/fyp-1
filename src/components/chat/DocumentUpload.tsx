
import React from "react";
import { X, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    </div>
  );
};

export default DocumentUpload;
