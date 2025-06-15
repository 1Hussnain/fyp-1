
// Main document hook: combines logic and exposes API
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { documentService } from "@/services/supabase";
import { Document } from "@/types/database";
import { useDocumentFolders } from "./useDocumentFolders";
import { useDocumentRealtime } from "./useDocumentRealtime";
import { isDocument } from "@/utils/documentGuards";

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const {
    folders,
    setFolders,
    fetchFolders,
    createNewFolder,
  } = useDocumentFolders();

  // Get authenticated user id statefully
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    })();
  }, []);

  // Fetch documents on mount or user change
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      const result = await documentService.getAll(user.id);
      if (result.success) {
        setDocuments(result.data || []);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching documents",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch folders on mount/user change
  useEffect(() => {
    if (userId) {
      fetchDocuments();
      fetchFolders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Realtime sync
  useDocumentRealtime(userId, setDocuments);

  // Document upload
  const uploadDoc = async (file: File) => {
    try {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB",
          variant: "destructive",
        });
        return { success: false, error: "File too large" };
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      const result = await documentService.upload(file, user.id);
      if (result.success) {
        toast({
          title: "Document uploaded",
          description: "Document uploaded successfully",
        });
        // fetchDocuments(); -- handled by realtime
      } else {
        throw new Error(result.error);
      }
      return result;
    } catch (error: any) {
      toast({
        title: "Error uploading document",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  // Document delete
  const deleteExistingDocument = async (documentId: string) => {
    try {
      const result = await documentService.delete(documentId);
      if (result.success) {
        toast({
          title: "Document deleted",
          description: "Document deleted successfully",
        });
        fetchDocuments();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Error deleting document",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    documents,
    folders,
    loading,
    fetchDocuments,
    fetchFolders,
    createNewFolder,
    deleteExistingDocument,
    uploadDocument: uploadDoc,
    deleteDocument: deleteExistingDocument,
  };
};
