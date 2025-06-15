import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { documentService, folderService } from "@/services/supabase";
import { Document, Folder } from "@/types/database";

// Helper type guard function
function isDocument(obj: any): obj is Document {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.file_url === "string" &&
    // folder_id can be string or null
    ("folder_id" in obj ? typeof obj.folder_id === "string" || obj.folder_id === null : true) &&
    typeof obj.user_id === "string" &&
    ("size_bytes" in obj ? typeof obj.size_bytes === "number" || obj.size_bytes === null : true) &&
    ("file_type" in obj ? typeof obj.file_type === "string" || obj.file_type === null : true) &&
    ("deleted" in obj ? typeof obj.deleted === "boolean" : true) &&
    typeof obj.uploaded_at === "string"
  );
}

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
          if (payload.eventType === "INSERT" && isDocument(payload.new)) {
            setDocuments((curr) => [
              payload.new,
              ...curr,
            ] as Document[]);
          } else if (payload.eventType === "UPDATE" && isDocument(payload.new)) {
            setDocuments((curr) =>
              curr.map((doc) =>
                doc.id === payload.new.id ? payload.new : doc
              ) as Document[]
            );
          } else if (payload.eventType === "DELETE" && isDocument(payload.old)) {
            setDocuments((curr) =>
              curr.filter((doc) => doc.id !== payload.old.id) as Document[]
            );
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
