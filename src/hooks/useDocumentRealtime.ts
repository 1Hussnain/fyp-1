
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isDocument } from "@/utils/documentGuards";
import { Document } from "@/types/database";

export function useDocumentRealtime(userId: string | null, setDocuments: React.Dispatch<React.SetStateAction<Document[]>>) {
  useEffect(() => {
    if (!userId) return;
    let channel: any;
    channel = supabase
      .channel("documents-changes")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "documents",
        filter: `user_id=eq.${userId} AND deleted=is.false`
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
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [userId, setDocuments]);
}
