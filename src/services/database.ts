
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Type definitions
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Folder = Database['public']['Tables']['folders']['Row'];
export type Document = Database['public']['Tables']['documents']['Row'];
export type Tag = Database['public']['Tables']['tags']['Row'];
export type ChatHistory = Database['public']['Tables']['chat_history']['Row'];
export type Preferences = Database['public']['Tables']['preferences']['Row'];
export type Milestone = Database['public']['Tables']['milestones']['Row'];
export type AuditLog = Database['public']['Tables']['audit_logs']['Row'];

// Authentication functions
export const signupUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getUserProfile = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .single();
  return { data, error };
};

// Folder functions
export const createFolder = async (name: string) => {
  const { data, error } = await supabase
    .from('folders')
    .insert({ name, user_id: (await getCurrentUser())?.id })
    .select()
    .single();
  return { data, error };
};

export const getFolders = async () => {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const deleteFolder = async (folderId: string) => {
  const { error } = await supabase
    .from('folders')
    .delete()
    .eq('id', folderId);
  return { error };
};

// Document functions
export const uploadDocument = async (file: File, folderId?: string) => {
  try {
    // Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${(await getCurrentUser())?.id}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    // Save document record to database
    const { data, error } = await supabase
      .from('documents')
      .insert({
        name: file.name,
        file_url: publicUrl,
        folder_id: folderId,
        user_id: (await getCurrentUser())?.id,
        size_bytes: file.size,
        file_type: file.type,
      })
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

export const getDocuments = async (folderId?: string) => {
  let query = supabase
    .from('documents')
    .select('*')
    .eq('deleted', false)
    .order('uploaded_at', { ascending: false });

  if (folderId) {
    query = query.eq('folder_id', folderId);
  }

  const { data, error } = await query;
  return { data, error };
};

export const deleteDocument = async (documentId: string) => {
  const { error } = await supabase
    .from('documents')
    .update({ deleted: true })
    .eq('id', documentId);
  return { error };
};

// Tag functions
export const getTags = async () => {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');
  return { data, error };
};

export const createTag = async (name: string) => {
  const { data, error } = await supabase
    .from('tags')
    .insert({ name })
    .select()
    .single();
  return { data, error };
};

export const tagDocument = async (documentId: string, tagIds: string[]) => {
  // First remove existing tags
  await supabase
    .from('document_tags')
    .delete()
    .eq('document_id', documentId);

  // Add new tags
  const { data, error } = await supabase
    .from('document_tags')
    .insert(
      tagIds.map(tagId => ({ document_id: documentId, tag_id: tagId }))
    );
  return { data, error };
};

export const getDocumentTags = async (documentId: string) => {
  const { data, error } = await supabase
    .from('document_tags')
    .select(`
      tag_id,
      tags (
        id,
        name
      )
    `)
    .eq('document_id', documentId);
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

export const saveChatMessage = async (sender: 'user' | 'ai', message: string, metadata?: any) => {
  const { data, error } = await supabase
    .from('chat_history')
    .insert({
      user_id: (await getCurrentUser())?.id,
      sender,
      message,
      metadata,
    })
    .select()
    .single();
  return { data, error };
};

export const clearChatHistory = async () => {
  const { error } = await supabase
    .from('chat_history')
    .delete()
    .eq('user_id', (await getCurrentUser())?.id);
  return { error };
};

// Preferences functions
export const getUserPreferences = async () => {
  const { data, error } = await supabase
    .from('preferences')
    .select('*')
    .single();
  return { data, error };
};

export const saveUserPreferences = async (preferences: Partial<Preferences>) => {
  const user = await getCurrentUser();
  if (!user) return { data: null, error: 'User not authenticated' };

  const { data, error } = await supabase
    .from('preferences')
    .upsert({
      user_id: user.id,
      ...preferences,
    })
    .select()
    .single();
  return { data, error };
};

// Milestone functions
export const logMilestone = async (type: string, detail?: any) => {
  const { data, error } = await supabase
    .from('milestones')
    .insert({
      user_id: (await getCurrentUser())?.id,
      type,
      detail,
    })
    .select()
    .single();
  return { data, error };
};

export const getUserMilestones = async () => {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .order('triggered_at', { ascending: false });
  return { data, error };
};

// Audit log functions
export const logAuditEvent = async (action: string, description?: string) => {
  const { data, error } = await supabase
    .from('audit_logs')
    .insert({
      user_id: (await getCurrentUser())?.id,
      action,
      description,
    })
    .select()
    .single();
  return { data, error };
};

export const getAuditLogs = async () => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};
