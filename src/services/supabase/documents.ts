
import { supabase } from '@/integrations/supabase/client';
import { Document, DocumentInsert, Folder, FolderInsert, ServiceResponse } from '@/types/database';

export const documentService = {
  async getAll(userId: string): Promise<ServiceResponse<Document[]>> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .eq('deleted', false)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data || []
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  async upload(file: File, userId: string): Promise<ServiceResponse<Document>> {
    try {
      // Upload file to storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Save document record
      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: userId,
          name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          size_bytes: file.size
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  async delete(id: string): Promise<ServiceResponse<void>> {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ deleted: true })
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export const folderService = {
  async getAll(userId: string): Promise<ServiceResponse<Folder[]>> {
    try {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', userId)
        .order('name');

      if (error) throw error;

      return {
        success: true,
        data: data || []
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  async create(folder: FolderInsert): Promise<ServiceResponse<Folder>> {
    try {
      const { data, error } = await supabase
        .from('folders')
        .insert(folder)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};
