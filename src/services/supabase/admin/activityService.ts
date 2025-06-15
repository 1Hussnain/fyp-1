
/**
 * Admin Activity Logging Service
 * 
 * Provides audit trail functionality for admin actions including:
 * - Activity logging for all admin operations
 * - Centralized audit trail management
 */

import { supabase } from '@/integrations/supabase/client';
import { ServiceResponse } from '@/types/database';

/**
 * Log admin activity
 */
export async function logAdminActivity(
  actionType: string, 
  targetType?: string, 
  targetId?: string, 
  details?: any
): Promise<ServiceResponse<void>> {
  try {
    const { error } = await supabase.rpc('log_admin_activity', {
      action_type: actionType,
      target_type: targetType,
      target_id: targetId,
      details: details ? JSON.stringify(details) : null
    });

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error('[logAdminActivity] Error logging activity:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Failed to log activity' 
    };
  }
}
