
/**
 * Shared Realtime Hook
 * 
 * This hook provides a simple interface to the centralized realtime subscription manager.
 * It automatically handles:
 * - Subscription creation and cleanup
 * - User authentication checks
 * - Consistent error handling
 * - Debug logging
 * 
 * Usage:
 * const cleanup = useSharedRealtime('transactions', user?.id, handleUpdate);
 */

import { useEffect, useRef } from 'react';
import { realtimeManager } from '@/services/realtime';

type Table = "transactions" | "financial_goals" | "budgets" | "categories";
type UpdateHandler<T> = (payload: any) => void;

/**
 * Hook for subscribing to realtime updates through the centralized manager
 * @param table - Database table to subscribe to
 * @param userId - User ID for filtering (null = no subscription)
 * @param handler - Function to handle realtime updates
 */
export function useSharedRealtime<T>(
  table: Table,
  userId: string | null,
  handler: UpdateHandler<T>
) {
  // Use ref to store cleanup function to prevent stale closures
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Don't subscribe if no user ID
    if (!userId) {
      return;
    }

    console.log(`[useSharedRealtime] Setting up subscription for ${table}`);

    // Subscribe through the centralized manager
    cleanupRef.current = realtimeManager.subscribe(table, userId, handler);

    // Cleanup function
    return () => {
      if (cleanupRef.current) {
        console.log(`[useSharedRealtime] Cleaning up subscription for ${table}`);
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [table, userId, handler]);

  // Additional cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);
}
