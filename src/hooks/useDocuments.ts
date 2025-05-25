
import { useState, useEffect } from 'react';
import { 
  getDocuments, 
  getFolders, 
  uploadDocument, 
  createFolder, 
  deleteDocument, 
  deleteFolder,
  Document,
  Folder 
} from '@/services/database';
import { toast } from '@/components/ui/sonner';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [documentsResult, foldersResult] = await Promise.all([
        getDocuments(),
        getFolders()
      ]);

      if (documentsResult.error) {
        console.error('Error loading documents:', documentsResult.error);
      } else {
        setDocuments(documentsResult.data || []);
      }

      if (foldersResult.error) {
        console.error('Error loading folders:', foldersResult.error);
      } else {
        setFolders(foldersResult.data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load documents and folders');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async (file: File, folderId?: string) => {
    try {
      setUploading(true);
      const { data, error } = await uploadDocument(file, folderId);
      
      if (error) {
        toast.error('Failed to upload document');
        return { success: false, error };
      }

      if (data) {
        setDocuments(prev => [data, ...prev]);
        toast.success('Document uploaded successfully');
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
      return { success: false, error };
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = async (name: string) => {
    try {
      const { data, error } = await createFolder(name);
      
      if (error) {
        toast.error('Failed to create folder');
        return { success: false, error };
      }

      if (data) {
        setFolders(prev => [data, ...prev]);
        toast.success('Folder created successfully');
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
      return { success: false, error };
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const { error } = await deleteDocument(documentId);
      
      if (error) {
        toast.error('Failed to delete document');
        return { success: false, error };
      }

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast.success('Document deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
      return { success: false, error };
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      const { error } = await deleteFolder(folderId);
      
      if (error) {
        toast.error('Failed to delete folder');
        return { success: false, error };
      }

      setFolders(prev => prev.filter(folder => folder.id !== folderId));
      // Also remove documents in this folder from the list
      setDocuments(prev => prev.filter(doc => doc.folder_id !== folderId));
      toast.success('Folder deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('Failed to delete folder');
      return { success: false, error };
    }
  };

  return {
    documents,
    folders,
    loading,
    uploading,
    uploadDocument: handleUploadDocument,
    createFolder: handleCreateFolder,
    deleteDocument: handleDeleteDocument,
    deleteFolder: handleDeleteFolder,
    refreshData: loadData,
  };
};
