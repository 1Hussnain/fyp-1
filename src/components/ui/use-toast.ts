
/**
 * Toast Hook Export Module
 * 
 * Re-exports the toast functionality from the main toast hook.
 * This provides a convenient import path for toast notifications
 * throughout the application.
 */

import { useToast, toast } from "@/hooks/use-toast";

// Export both the hook and the toast function for different use cases
export { useToast, toast };
