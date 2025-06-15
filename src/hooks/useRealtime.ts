
/**
 * Optimized Realtime Hook
 * 
 * Provides real-time updates for Supabase tables with:
 * - Proper subscription cleanup to prevent "subscribe multiple times" errors
 * - Unique channel naming to avoid conflicts
 * - Debounced updates for performance
 * - Error recovery mechanisms
 */

import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

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
 * Optimized hook for real-time Supabase subscriptions
 * @param table - Database table to subscribe to
 * @param userId - User ID for filtering
 * @param setState - State setter function
 * @param config - Configuration options
 */
export function useRealtime<T extends { id: string; user_id?: string }>(
  table: Table,
  userId: string | null,
  setState: UpdateFn<T>,
  config: RealtimeConfig = {}
) {
  const {
    enableDebounce = true,
    debounceMs = 300,
    enableRetry = true,
    maxRetries = 3
  } = config;

  const channelRef = useRef<any>(null);
  const retryCountRef = useRef(0);
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const isSubscribedRef = useRef(false);

  // Create unique channel name to prevent conflicts
  const channelName = `${table}-realtime-${userId || 'anonymous'}-${Date.now()}`;

  /**
   * Debounced state update to prevent excessive re-renders
   */
  const debouncedUpdate = useCallback((updateFn: () => void) => {
    if (!enableDebounce) {
      updateFn();
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(updateFn, debounceMs);
  }, [enableDebounce, debounceMs]);

  /**
   * Handle real-time payload updates
   */
  const handleRealtimeUpdate = useCallback((payload: any) => {
    console.log(`[Realtime] ${table} update:`, payload.eventType, payload.new?.id);

    const updateState = () => {
      if (payload.eventType === "INSERT" && payload.new) {
        setState(prev => {
          // Prevent duplicates
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
    };

    debouncedUpdate(updateState);
  }, [table, setState, debouncedUpdate]);

  /**
   * Setup subscription with error handling
   */
  const setupSubscription = useCallback(() => {
    if (!userId || isSubscribedRef.current) {
      return;
    }

    try {
      console.log(`[Realtime] Setting up subscription for ${table}`);

      channelRef.current = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table,
            filter: `user_id=eq.${userId}`
          },
          handleRealtimeUpdate
        )
        .subscribe((status) => {
          console.log(`[Realtime] ${table} subscription status:`, status);
          
          if (status === 'SUBSCRIBED') {
            isSubscribedRef.current = true;
            retryCountRef.current = 0;
          } else if (status === 'CHANNEL_ERROR' && enableRetry) {
            if (retryCountRef.current < maxRetries) {
              retryCountRef.current++;
              console.warn(`[Realtime] Retrying subscription (${retryCountRef.current}/${maxRetries})`);
              setTimeout(setupSubscription, 1000 * retryCountRef.current);
            }
          }
        });

    } catch (error) {
      console.error(`[Realtime] Subscription error for ${table}:`, error);
      isSubscribedRef.current = false;
    }
  }, [userId, table, channelName, handleRealtimeUpdate, enableRetry, maxRetries]);

  /**
   * Cleanup subscription
   */
  const cleanup = useCallback(() => {
    console.log(`[Realtime] Cleaning up ${table} subscription`);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    
    isSubscribedRef.current = false;
  }, [table]);

  useEffect(() => {
    setupSubscription();
    return cleanup;
  }, [setupSubscription, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);
}
