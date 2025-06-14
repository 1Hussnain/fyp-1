
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Eye, Trash2, FileText, FileImage, Download, X, Zap, Loader2 } from "lucide-react";
import { useTextExtraction } from "@/hooks/useTextExtraction";

// Document type options
const documentTypes = [
  "Bank Statement",
  "Invoice",
  "Bill",
  "Tax Document",
  "Receipt",
  "Other"
];

// Document interface
interface Document {
  id: number;
  fileName: string;
  type: string;
  note: string;
  uploadedAt: string;
  preview: string;
  url: string;
  fileType: "pdf" | "image" | "other";
  extractedText?: string;
  extractionConfidence?: number;
}

const DocumentViewer = () => {
  // State for documents and form
  const [documents, setDocuments] = useState<Document[]>([]);
  const [form, setForm] = useState({
    file: null as File | null,
    docType: "Bank Statement",
    note: "",
  });
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [fileInputKey, setFileInputKey] = useState<number>(0);
  const [showExtractedText, setShowExtractedText] = useState<{[key: number]: boolean}>({});
  
  const { extractTextFromFile, isExtracting, extractionStage } = useTextExtraction();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.target.name === "file" && e.target instanceof HTMLInputElement && e.target.files?.[0]) {
      setForm({ ...form, file: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // Determine file type icon
  const getFileTypeInfo = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      return { type: "pdf", icon: <FileText className="text-red-500" /> };
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
      return { type: "image", icon: <FileImage className="text-blue-500" /> };
    }
    return { type: "other", icon: <FileText className="text-gray-500" /> };
  };

  // Handle document upload
  const handleUpload = () => {
    if (!form.file) {
      toast.error("Please select a file");
      return;
    }

    // Get file type info
    const { type: fileType } = getFileTypeInfo(form.file.name);

    // Create new document
    const newDoc: Document = {
      id: Date.now(),
      fileName: form.file.name,
      type: form.docType,
      note: form.note,
      uploadedAt: new Date().toLocaleDateString(),
      preview: form.note || "This document has been uploaded and is ready for text extraction and analysis.",
      url: URL.createObjectURL(form.file),
      fileType: fileType as "pdf" | "image" | "other",
    };

    // Add to documents array
    setDocuments([newDoc, ...documents]);
    
    // Reset form
    setForm({ file: null, docType: "Bank Statement", note: "" });
    setFileInputKey(prev => prev + 1);
    toast.success("Document uploaded successfully");
  };

  // Extract text from document
  const handleExtractText = async (doc: Document) => {
    try {
      // Create a file object from the URL (this is simplified - in reality you'd store the file)
      const response = await fetch(doc.url);
      const blob = await response.blob();
      const file = new File([blob], doc.fileName, { type: blob.type });
      
      const result = await extractTextFromFile(file);
      if (result) {
        // Update the document with extracted text
        setDocuments(prev => prev.map(d => 
          d.id === doc.id 
            ? { 
                ...d, 
                extractedText: result.extractedText.text,
                extractionConfidence: result.extractedText.confidence
              }
            : d
        ));
        toast.success("Text extracted successfully!");
      }
    } catch (error) {
      toast.error("Failed to extract text from document");
    }
  };

  // Delete document
  const deleteDocument = (id: number) => {
    if (confirm("Are you sure you want to delete this document?")) {
      const updated = documents.filter((doc) => doc.id !== id);
      setDocuments(updated);
      
      // If deleted document was selected in preview, close preview
      if (selectedDoc?.id === id) {
        setSelectedDoc(null);
      }
      
      toast.success("Document deleted");
    }
  };

  // Open and close preview
  const openPreview = (doc: Document) => setSelectedDoc(doc);
  const closePreview = () => setSelectedDoc(null);

  // Toggle extracted text visibility
  const toggleExtractedText = (docId: number) => {
    setShowExtractedText(prev => ({
      ...prev,
      [docId]: !prev[docId]
    }));
  };

  // Check if file supports text extraction
  const canExtractText = (doc: Document) => {
    return doc.fileType === "pdf" || doc.fileType === "image";
  };

  // For empty state
  const EmptyState = () => (
    <div className="bg-gray-50 p-8 rounded-xl border border-dashed border-gray-300 text-center">
      <FileText size={48} className="mx-auto mb-3 text-gray-400" />
      <h3 className="text-xl font-medium text-gray-700">No documents yet</h3>
      <p className="text-gray-500 mt-2">Upload documents to extract text and analyze content</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Document Upload & Text Extraction</h1>
        
        {/* Upload Form */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Upload New Document</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="file">
                Select File
              </label>
              <Input
                id="file"
                key={fileInputKey}
                type="file"
                name="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.csv"
                onChange={handleChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">
                Max size: 5MB. Text extraction available for images and PDFs
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="docType">
                Document Type
              </label>
              <select
                id="docType"
                name="docType"
                value={form.docType}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                {documentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" htmlFor="note">
                Notes (Optional)
              </label>
              <textarea
                id="note"
                name="note"
                value={form.note}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[100px]"
                placeholder="Add any notes about this document..."
              />
            </div>
            
            <div className="md:col-span-2">
              <Button onClick={handleUpload} className="bg-indigo-600 hover:bg-indigo-700">
                Upload Document
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Processing Indicator */}
        {isExtracting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span className="text-sm text-blue-600 font-medium">{extractionStage}</span>
            </div>
          </motion.div>
        )}
        
        {/* Document Grid */}
        <h2 className="text-xl font-semibold mb-4">Your Documents</h2>
        
        {documents.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { 
                transition: { staggerChildren: 0.1 } 
              },
              hidden: {}
            }}
          >
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                className="bg-white p-4 rounded-xl shadow-md relative"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getFileTypeInfo(doc.fileName).icon}
                  <h4 className="font-semibold text-md truncate flex-1">{doc.fileName}</h4>
                </div>
                
                <div className="flex gap-1 mb-2">
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                    {doc.type}
                  </Badge>
                  {doc.extractedText && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      Text Available
                    </Badge>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mb-2">{doc.uploadedAt}</p>
                <p className="text-sm text-gray-700 line-clamp-3 mb-3">{doc.preview}</p>
                
                {/* Extracted Text Preview */}
                {doc.extractedText && showExtractedText[doc.id] && (
                  <div className="bg-gray-50 border rounded p-2 mb-3 max-h-32 overflow-y-auto">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">Extracted Text</span>
                      {doc.extractionConfidence && (
                        <span className="text-xs text-gray-500">
                          {(doc.extractionConfidence * 100).toFixed(0)}% confidence
                        </span>
                      )}
                    </div>
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {doc.extractedText.substring(0, 200)}
                      {doc.extractedText.length > 200 && '...'}
                    </pre>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-1">
                  <Button
                    size="sm"
                    onClick={() => openPreview(doc)}
                    className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-xs"
                  >
                    <Eye size={12} /> View
                  </Button>
                  
                  {canExtractText(doc) && !doc.extractedText && (
                    <Button
                      size="sm"
                      onClick={() => handleExtractText(doc)}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-xs"
                      disabled={isExtracting}
                    >
                      <Zap size={12} /> Extract
                    </Button>
                  )}
                  
                  {doc.extractedText && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleExtractedText(doc.id)}
                      className="flex items-center gap-1 text-xs"
                    >
                      <FileText size={12} /> 
                      {showExtractedText[doc.id] ? 'Hide' : 'Show'} Text
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteDocument(doc.id)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Trash2 size={12} /> Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
      
      {/* Document Preview Modal */}
      {selectedDoc && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePreview}
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
                <h2 className="text-2xl font-bold">{selectedDoc.fileName}</h2>
                <Button variant="ghost" size="icon" onClick={closePreview}>
                  <X size={20} />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Type: {selectedDoc.type}</p>
                  <p className="text-sm text-gray-500">Uploaded: {selectedDoc.uploadedAt}</p>
                  {selectedDoc.extractionConfidence && (
                    <p className="text-sm text-gray-500">
                      Text Extraction: {(selectedDoc.extractionConfidence * 100).toFixed(0)}% confidence
                    </p>
                  )}
                </div>
                
                {selectedDoc.fileType === "image" && (
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={selectedDoc.url}
                      alt={selectedDoc.fileName}
                      className="w-full h-auto"
                    />
                  </div>
                )}
                
                {selectedDoc.extractedText && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-medium mb-2">Extracted Text</h3>
                    <div className="bg-white border rounded p-3 max-h-64 overflow-y-auto">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedDoc.extractedText}
                      </pre>
                    </div>
                  </div>
                )}
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-medium mb-2">Document Notes</h3>
                  <p className="text-sm">{selectedDoc.preview}</p>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <a
                    href={selectedDoc.url}
                    download={selectedDoc.fileName}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
                  >
                    <Download size={16} /> Download
                  </a>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => {
                      deleteDocument(selectedDoc.id);
                      closePreview();
                    }}
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DocumentViewer;
