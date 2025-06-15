import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { useDocuments } from "./useDocuments";
import { Document } from "@/types/database";

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

    // PATCH: Add type guard and check for 'data' presence
    const result = await uploadDocument(documentForm.file);

    if (result.success && "data" in result && result.data) {
      onDocumentUpload(
        result.data,
        `Uploaded document: ${documentForm.file.name}`
      );

      setDocumentForm({ file: null, docType: "Bank Statement", note: "" });
      setFileInputKey(prev => prev + 1);
      setShowDocumentUpload(false);
    }
  };

  // Delete document
  const handleDeleteDocument = async (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      await deleteDocument(id);
      
      // If deleted document was selected in preview, close preview
      if (selectedDoc?.id === id) {
        setSelectedDoc(null);
      }
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
    deleteDocument: handleDeleteDocument,
    openPreview,
    closePreview
  };
};
