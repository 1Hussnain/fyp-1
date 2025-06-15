
/**
 * Admin Services Module - Main Export
 * 
 * Provides a unified interface for all admin-specific operations including:
 * - User management and role assignment
 * - System analytics and reporting
 * - Activity logging and audit trails
 * - Cross-user data access
 */

export { adminUserService } from './userService';
export { adminAnalyticsService } from './analyticsService';
export { logAdminActivity } from './activityService';

// Re-export for backwards compatibility
import { adminUserService } from './userService';
import { adminAnalyticsService } from './analyticsService';

export const adminService = {
  user: adminUserService,
  analytics: adminAnalyticsService
};
