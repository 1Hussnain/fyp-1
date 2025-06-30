
/**
 * Admin Management Hook
 * 
 * Provides admin-specific functionality including:
 * - Admin role checking and validation
 * - User management operations
 * - Activity logging and audit trails
 * - System analytics access
 */

import { useAuth } from '@/contexts/AuthContext';

export const useAdmin = () => {
  const { isAdmin, adminLoading, checkAdminStatus } = useAuth();

  return {
    isAdmin,
    loading: adminLoading,
    checkAdminStatus
  };
};

// Re-export the specialized hooks for backward compatibility
export { useAdminUsers } from './useAdminUsers';
export { useAdminAnalytics } from './useAdminAnalytics';
