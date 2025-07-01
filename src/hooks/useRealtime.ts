
/**
 * Legacy Realtime Hook - DEPRECATED
 * 
 * This hook is kept for backward compatibility but is now deprecated.
 * New code should use useSharedRealtime instead.
 * 
 * The centralized realtime manager (realtimeManager) handles all subscriptions
 * to prevent duplicate subscription errors and improve performance.
 * 
 * @deprecated Use useSharedRealtime instead
 */

import { useCallback } from "react";
import { useSharedRealtime } from './useSharedRealtime';

type EventType = "INSERT" | "UPDATE" | "DELETE";
type Table = "transactions" | "financial_goals" | "budgets" | "categories";
type UpdateFn<T> = React.Dispatch<React.SetStateAction<T[]>>;

interface RealtimeConfig {
  enableDebounce?: boolean;
  debounceMs?: number;
  enableRetry?: boolean;
  maxRetries?: number;
}

/**
 * Legacy realtime hook that now uses the centralized manager
 * @deprecated Use useSharedRealtime directly for new code
 */
export function useRealtime<T extends { id: string; user_id?: string }>(
  table: Table,
  userId: string | null,
  setState: UpdateFn<T>,
  config: RealtimeConfig = {}
) {
  /**
   * Handle real-time payload updates with state management
   * Processes INSERT, UPDATE, and DELETE events from Supabase
   */
  const handleRealtimeUpdate = useCallback((payload: any) => {
    console.log(`[useRealtime] ${table} update:`, payload.eventType, payload.new?.id);

    // Process different event types
    if (payload.eventType === "INSERT" && payload.new) {
      setState(prev => {
        // Prevent duplicates by checking if item already exists
        const exists = prev.some(item => item.id === payload.new.id);
        if (exists) return prev;
        return [payload.new, ...prev];
      });
    } else if (payload.eventType === "UPDATE" && payload.new) {
      setState(prev => 
        prev.map(item => 
          item.id === payload.new.id ? { ...item, ...payload.new } : item
        )
      );
    } else if (payload.eventType === "DELETE" && payload.old) {
      setState(prev => prev.filter(item => item.id !== payload.old.id));
    }
  }, [table, setState]);

  // Use the shared realtime system
  useSharedRealtime(table, userId, handleRealtimeUpdate);
}
