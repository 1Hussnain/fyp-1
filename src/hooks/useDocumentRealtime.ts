
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isDocument } from "@/utils/documentGuards";
import { Document } from "@/types/database";

export function useDocumentRealtime(userId: string | null, setDocuments: React.Dispatch<React.SetStateAction<Document[]>>) {
  // Real-time subscription temporarily disabled to fix crashes
  // useEffect(() => {
  //   if (!userId) return;
  //   console.log('[useDocumentRealtime] Real-time disabled');
  // }, [userId, setDocuments]);
}
