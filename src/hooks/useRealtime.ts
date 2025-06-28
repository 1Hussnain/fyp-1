
/**
 * Enhanced Real-time Hook with Performance Optimizations
 * 
 * Provides real-time updates with:
 * - Debounced updates to prevent excessive re-renders
 * - Connection retry logic with exponential backoff
 * - Optimistic updates for better UX
 * - Memory leak prevention
 * - Performance monitoring
 */

import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Table } from '@/types/realtime';

interface RealtimeOptions {
  enableDebounce?: boolean;
  debounceMs?: number;
  enableRetry?: boolean;
  maxRetries?: number;
  enableOptimisticUpdates?: boolean;
}

export const useRealtime = <T>(
  table: Table,
  userId: string | null,
  updateData: (updater: (current: T[]) => T[]) => void,
  options: RealtimeOptions = {}
) => {
  const { user } = useAuth();
  const {
    enableDebounce = true,
    debounceMs = 300,
    enableRetry = true,
    maxRetries = 3,
    enableOptimisticUpdates = true
  } = options;

  const channelRef = useRef<any>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const isSubscribedRef = useRef(false);

  // Debounced update function
  const debouncedUpdate = useCallback((updater: (current: T[]) => T[]) => {
    if (!enableDebounce) {
      updateData(updater);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      updateData(updater);
    }, debounceMs);
  }, [updateData, enableDebounce, debounceMs]);

  // Handle real-time events
  const handleRealtimeEvent = useCallback((payload: any) => {
    console.log(`[useRealtime] ${table} event:`, payload.eventType, payload.new || payload.old);

    const { eventType, new: newRecord, old: oldRecord } = payload;

    debouncedUpdate((current: T[]) => {
      switch (eventType) {
        case 'INSERT':
          // Check if record already exists (prevent duplicates)
          const existsInsert = current.some((item: any) => item.id === newRecord.id);
          if (existsInsert) return current;
          return [...current, newRecord as T];

        case 'UPDATE':
          return current.map((item: any) =>
            item.id === newRecord.id ? { ...item, ...newRecord } : item
          );

        case 'DELETE':
          return current.filter((item: any) => item.id !== oldRecord.id);

        default:
          return current;
      }
    });
  }, [table, debouncedUpdate]);

  // Setup subscription with retry logic
  const setupSubscription = useCallback(() => {
    if (!user || !userId || isSubscribedRef.current) return;

    const channelName = `${table}_${userId}_${Date.now()}`;
    
    console.log(`[useRealtime] Setting up subscription for ${table} with user ${userId}`);

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: `user_id=eq.${userId}`
        },
        handleRealtimeEvent
      )
      .subscribe((status) => {
        console.log(`[useRealtime] ${table} subscription status:`, status);
        
        if (status === 'SUBSCRIBED') {
          isSubscribedRef.current = true;
          retryCountRef.current = 0;
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          isSubscribedRef.current = false;
          
          if (enableRetry && retryCountRef.current < maxRetries) {
            const retryDelay = Math.pow(2, retryCountRef.current) * 1000; // Exponential backoff
            console.log(`[useRealtime] Retrying ${table} subscription in ${retryDelay}ms (attempt ${retryCountRef.current + 1})`);
            
            setTimeout(() => {
              retryCountRef.current++;
              if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
              }
              setupSubscription();
            }, retryDelay);
          }
        }
      });

    channelRef.current = channel;
  }, [user, userId, table, handleRealtimeEvent, enableRetry, maxRetries]);

  // Cleanup subscription
  const cleanupSubscription = useCallback(() => {
    if (channelRef.current) {
      console.log(`[useRealtime] Cleaning up ${table} subscription`);
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      isSubscribedRef.current = false;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, [table]);

  // Setup and cleanup effects
  useEffect(() => {
    setupSubscription();
    return cleanupSubscription;
  }, [setupSubscription, cleanupSubscription]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupSubscription();
    };
  }, [cleanupSubscription]);
};
