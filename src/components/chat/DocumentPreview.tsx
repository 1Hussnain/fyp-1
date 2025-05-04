
import React from "react";
import { motion } from "framer-motion";
import { X, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Document {
  id: number;
  fileName: string;
  type: string;
  note: string;
  uploadedAt: string;
  preview: string;
  url: string;
  fileType: "pdf" | "image" | "other";
}

interface DocumentPreviewProps {
  document: Document;
  onClose: () => void;
  onDelete: (id: number) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  onClose,
  onDelete,
}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full md:w-1/3 bg-white h-full overflow-y-auto"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{document.fileName}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Type: {document.type}</p>
              <p className="text-sm text-gray-500">Uploaded: {document.uploadedAt}</p>
            </div>
            
            {document.fileType === "image" && (
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={document.url}
                  alt={document.fileName}
                  className="w-full h-auto"
                />
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-medium mb-2">Document Content</h3>
              <p className="text-sm">{document.preview}</p>
            </div>
            
            <div className="mt-4 flex gap-2">
              <a
                href={document.url}
                download={document.fileName}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
              >
                <Download size={16} /> Download
              </a>
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50"
                onClick={() => {
                  onDelete(document.id);
                  onClose();
                }}
              >
                <Trash2 size={16} className="mr-1" /> Delete
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DocumentPreview;
