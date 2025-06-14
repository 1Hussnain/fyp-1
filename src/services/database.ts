
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

export interface ChatHistory {
  id: string;
  user_id: string;
  sender: string;
  message: string;
  metadata?: any;
  created_at: string;
}

export interface Preferences {
  id: string;
  user_id: string;
  theme: string;
  language: string;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
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

// Export functions for backward compatibility and easier imports
export const getDocuments = database.getDocuments;
export const getFolders = database.getFolders;
export const createFolder = database.createFolder;
export const deleteDocument = database.deleteDocument;

// Upload document function
export const uploadDocument = async (file: File, folderId?: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    // Create document record
    const documentData = {
      name: file.name,
      file_url: publicUrl,
      folder_id: folderId || null,
      user_id: user.id,
      size_bytes: file.size,
      file_type: file.type,
      deleted: false
    };

    const { data, error } = await database.createDocument(documentData);
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

// Delete folder function
export const deleteFolder = async (folderId: string) => {
  const { data, error } = await supabase
    .from('folders')
    .delete()
    .eq('id', folderId);
  
  return { data, error };
};

// Chat history functions
export const fetchChatHistory = async () => {
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .order('created_at', { ascending: true });
  
  return { data, error };
};

export const saveChatMessage = async (sender: string, message: string, metadata?: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('chat_history')
    .insert({
      user_id: user.id,
      sender,
      message,
      metadata
    })
    .select()
    .single();
  
  return { data, error };
};

// User preferences functions
export const getUserPreferences = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  return { data, error };
};

export const saveUserPreferences = async (preferences: Partial<Preferences>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('preferences')
    .upsert({
      user_id: user.id,
      ...preferences
    })
    .select()
    .single();
  
  return { data, error };
};
