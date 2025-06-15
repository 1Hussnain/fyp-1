import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { documentService, folderService } from "@/services/supabase";
import { Document, Folder } from "@/types/database";

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
    fetchFolders();
  }, []);

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

  const fetchFolders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const result = await folderService.getAll(user.id);
      if (result.success) {
        setFolders(result.data || []);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching folders",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createNewFolder = async (folderName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const result = await folderService.create({ name: folderName, user_id: user.id });
      if (result.success) {
        toast({
          title: "Folder created",
          description: "Folder created successfully",
        });
        fetchFolders();
      } else {
        throw new Error(result.error);
      }
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

  // Realtime updates for documents
  useEffect(() => {
    let channel: any;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      channel = supabase
        .channel("documents-changes")
        .on("postgres_changes", {
          event: "*",
          schema: "public",
          table: "documents",
          filter: `user_id=eq.${user.id} AND deleted=is.false`
        }, (payload) => {
          if (payload.eventType === "INSERT") {
            setDocuments((curr) => [payload.new, ...curr]);
          } else if (payload.eventType === "UPDATE") {
            setDocuments((curr) =>
              curr.map((doc) => doc.id === payload.new.id ? payload.new : doc)
            );
          } else if (payload.eventType === "DELETE") {
            setDocuments((curr) => curr.filter((doc) => doc.id !== payload.old.id));
          }
        })
        .subscribe();
    })();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

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
