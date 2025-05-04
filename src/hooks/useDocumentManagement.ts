
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

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

interface DocumentForm {
  file: File | null;
  docType: string;
  note: string;
}

export const useDocumentManagement = (
  onDocumentUpload: (document: Document, documentMessage: string) => void
) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showDocumentList, setShowDocumentList] = useState(false);
  const [fileInputKey, setFileInputKey] = useState<number>(0);
  const [documentForm, setDocumentForm] = useState<DocumentForm>({
    file: null,
    docType: "Bank Statement",
    note: "",
  });

  // Determine file type icon
  const getFileTypeInfo = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      return { type: "pdf" };
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
      return { type: "image" };
    }
    return { type: "other" };
  };

  // Handle document input changes
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.target.name === "file" && e.target instanceof HTMLInputElement && e.target.files?.[0]) {
      setDocumentForm({ ...documentForm, file: e.target.files[0] });
    } else {
      setDocumentForm({ ...documentForm, [e.target.name]: e.target.value });
    }
  };

  // Handle document upload
  const handleDocumentUpload = () => {
    if (!documentForm.file) {
      toast.error("Please select a file");
      return;
    }

    // Get file type info
    const { type: fileType } = getFileTypeInfo(documentForm.file.name);

    // Create new document
    const newDoc: Document = {
      id: Date.now(),
      fileName: documentForm.file.name,
      type: documentForm.docType,
      note: documentForm.note,
      uploadedAt: new Date().toLocaleDateString(),
      preview: documentForm.note || "This document contains financial information that has been automatically processed. Click 'View' to see more details.",
      url: URL.createObjectURL(documentForm.file),
      fileType: fileType as "pdf" | "image" | "other",
    };

    // Add to documents array
    setDocuments([newDoc, ...documents]);
    
    // Call the callback to add document message to chat
    onDocumentUpload(
      newDoc,
      `Uploaded document: ${documentForm.file.name}`
    );
    
    // Reset form
    setDocumentForm({ file: null, docType: "Bank Statement", note: "" });
    setFileInputKey(prev => prev + 1);
    setShowDocumentUpload(false);
    toast.success("Document uploaded successfully");
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
      return true;
    }
    return false;
  };

  // Open preview
  const openPreview = (doc: Document) => setSelectedDoc(doc);
  const closePreview = () => setSelectedDoc(null);

  return {
    documents,
    selectedDoc,
    showDocumentUpload,
    showDocumentList,
    fileInputKey,
    documentForm,
    setShowDocumentList,
    setShowDocumentUpload,
    handleDocumentChange,
    handleDocumentUpload,
    deleteDocument,
    openPreview,
    closePreview
  };
};
