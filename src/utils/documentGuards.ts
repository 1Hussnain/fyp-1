
import { Document } from "@/types/database";

/**
 * Type guard for Document objects (from Supabase).
 */
export function isDocument(obj: any): obj is Document {
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
