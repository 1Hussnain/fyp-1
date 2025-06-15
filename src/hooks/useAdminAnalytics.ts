
/**
 * Admin Analytics Hook
 */

import { useState, useEffect } from 'react';
import { adminAnalyticsService } from '@/services/supabase/admin';
import { AdminActivity } from '@/types/database';

export const useAdminAnalytics = () => {
  const [systemAnalytics, setSystemAnalytics] = useState<any>(null);
  const [activityLogs, setActivityLogs] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const [analyticsResult, logsResult] = await Promise.all([
        adminAnalyticsService.getSystemAnalytics(),
        adminAnalyticsService.getActivityLogs()
      ]);

      if (analyticsResult.success && analyticsResult.data) {
        setSystemAnalytics(analyticsResult.data);
      } else {
        setError(analyticsResult.error || 'Failed to load analytics');
      }

      if (logsResult.success && logsResult.data) {
        setActivityLogs(logsResult.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return {
    systemAnalytics,
    activityLogs,
    loading,
    error,
    refresh: loadAnalytics
  };
};
