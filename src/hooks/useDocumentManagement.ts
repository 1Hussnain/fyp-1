
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { useDocuments } from "./useDocuments";
import { Document } from "@/services/database";

interface DocumentForm {
  file: File | null;
  docType: string;
  note: string;
}

export const useDocumentManagement = (
  onDocumentUpload: (document: Document, documentMessage: string) => void
) => {
  const { documents, uploadDocument, deleteDocument } = useDocuments();
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
  const handleDocumentUpload = async () => {
    if (!documentForm.file) {
      toast.error("Please select a file");
      return;
    }

    const result = await uploadDocument(documentForm.file);
    
    if (result.success && result.data) {
      // Call the callback to add document message to chat
      onDocumentUpload(
        result.data,
        `Uploaded document: ${documentForm.file.name}`
      );
      
      // Reset form
      setDocumentForm({ file: null, docType: "Bank Statement", note: "" });
      setFileInputKey(prev => prev + 1);
      setShowDocumentUpload(false);
    }
  };

  // Delete document
  const handleDeleteDocument = async (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      const result = await deleteDocument(id);
      
      if (result.success) {
        // If deleted document was selected in preview, close preview
        if (selectedDoc?.id === id) {
          setSelectedDoc(null);
        }
        return true;
      }
      return false;
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
    deleteDocument: handleDeleteDocument,
    openPreview,
    closePreview
  };
};
