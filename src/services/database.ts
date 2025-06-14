
import { supabase } from "@/integrations/supabase/client";

export interface Document {
  id: string;
  name: string;
  file_url: string;
  folder_id: string | null;
  user_id: string;
  size_bytes: number | null;
  file_type: string | null;
  deleted: boolean;
  uploaded_at: string;
  ai_parsed_data?: any;
}

export interface Folder {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export const database = {
  // Document operations
  async getDocuments() {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('deleted', false)
      .order('uploaded_at', { ascending: false });
    
    return { data, error };
  },

  async createDocument(document: Omit<Document, 'id' | 'uploaded_at'>) {
    const { data, error } = await supabase
      .from('documents')
      .insert(document)
      .select()
      .single();
    
    return { data, error };
  },

  async updateDocument(id: string, updates: Partial<Document>) {
    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  async deleteDocument(id: string) {
    const { data, error } = await supabase
      .from('documents')
      .update({ deleted: true })
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  // Folder operations
  async getFolders() {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async createFolder(folder: Omit<Folder, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('folders')
      .insert(folder)
      .select()
      .single();
    
    return { data, error };
  }
};
