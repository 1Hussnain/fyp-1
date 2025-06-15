import React from "react";
import { motion } from "framer-motion";
import { X, FileText, FileImage, Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Document } from "@/services/database";

interface DocumentListProps {
  documents: Document[];
  onClose: () => void;
  onPreview: (document: Document) => void;
  onDelete: (id: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onClose,
  onPreview,
  onDelete,
}) => {
  // Determine file type icon
  const getFileTypeInfo = (fileName: string | null) => {
    if (!fileName) return { type: "other", icon: <FileText className="text-gray-500" /> };
    
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      return { type: "pdf", icon: <FileText className="text-red-500" /> };
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
      return { type: "image", icon: <FileImage className="text-blue-500" /> };
    }
    return { type: "other", icon: <FileText className="text-gray-500" /> };
  };

  if (!documents || documents.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 bg-white border rounded-md shadow-md p-2 max-h-[250px] overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-2 p-1">
        <h3 className="font-medium text-sm">Your Documents</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 text-xs" 
          onClick={onClose}
        >
          <X size={14} />
        </Button>
      </div>
      <div className="space-y-2">
        {documents.map((doc) => (
          <div key={doc.id} className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center gap-2">
              {getFileTypeInfo(doc.name).icon}
              <span className="text-sm font-medium truncate max-w-[150px]">{doc.name || 'Untitled'}</span>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0" 
                onClick={() => onPreview(doc)}
              >
                <Eye size={14} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 text-red-500" 
                onClick={() => onDelete(doc.id)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default DocumentList;
