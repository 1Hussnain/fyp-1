
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  getDocuments,
  getFolders,
  createFolder,
  deleteDocument,
  uploadDocument,
} from "@/services/database";

export const useDocuments = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
    fetchFolders();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const { data, error } = await getDocuments();
      if (error) throw error;
      setDocuments(data || []);
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

  const fetchFolders = async () => {
    setLoading(true);
    try {
      const { data, error } = await getFolders();
      if (error) throw error;
      setFolders(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching folders",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewFolder = async (folderName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      await createFolder({ name: folderName, user_id: user.id });
      toast({
        title: "Folder created",
        description: "Folder created successfully",
      });
      fetchFolders();
    } catch (error: any) {
      toast({
        title: "Error creating folder",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteExistingDocument = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
      toast({
        title: "Document deleted",
        description: "Document deleted successfully",
      });
      fetchDocuments();
    } catch (error: any) {
      toast({
        title: "Error deleting document",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const uploadDoc = async (file: File) => {
    try {
      const result = await uploadDocument(file);
      if (result.success) {
        toast({
          title: "Document uploaded",
          description: "Document uploaded successfully",
        });
        fetchDocuments();
      }
      return result;
    } catch (error: any) {
      toast({
        title: "Error uploading document",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error };
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
