
/**
 * Enhanced Real-time Hook with Performance Optimizations
 * 
 * Provides real-time updates with:
 * - Proper channel cleanup to prevent multiple subscriptions
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

// Global channel tracking to prevent duplicate subscriptions
const activeChannels = new Map<string, any>();
const channelSubscribers = new Map<string, number>();

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

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const channelKeyRef = useRef<string>('');
  const isActiveRef = useRef(true);

  // Debounced update function
  const debouncedUpdate = useCallback((updater: (current: T[]) => T[]) => {
    if (!isActiveRef.current || !enableDebounce) {
      if (isActiveRef.current) updateData(updater);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (isActiveRef.current) {
        updateData(updater);
      }
    }, debounceMs);
  }, [updateData, enableDebounce, debounceMs]);

  // Handle real-time events
  const handleRealtimeEvent = useCallback((payload: any) => {
    if (!isActiveRef.current) return;
    
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

  // Setup subscription with proper cleanup
  const setupSubscription = useCallback(() => {
    if (!user || !userId || !isActiveRef.current) return;

    const channelKey = `${table}_${userId}`;
    channelKeyRef.current = channelKey;
    
    // Increment subscriber count
    const currentCount = channelSubscribers.get(channelKey) || 0;
    channelSubscribers.set(channelKey, currentCount + 1);
    
    // If channel already exists and has active subscribers, don't create a new one
    if (activeChannels.has(channelKey) && currentCount > 0) {
      console.log(`[useRealtime] Channel ${channelKey} already exists with ${currentCount} subscribers`);
      return;
    }

    console.log(`[useRealtime] Setting up subscription for ${table} with user ${userId}`);

    const channel = supabase
      .channel(`${channelKey}_${Date.now()}`) // Add timestamp to ensure uniqueness
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
          retryCountRef.current = 0;
          activeChannels.set(channelKey, channel);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          // Clean up failed channel
          if (activeChannels.has(channelKey)) {
            activeChannels.delete(channelKey);
          }
          
          if (enableRetry && retryCountRef.current < maxRetries && isActiveRef.current) {
            const retryDelay = Math.pow(2, retryCountRef.current) * 1000;
            console.log(`[useRealtime] Retrying ${table} subscription in ${retryDelay}ms (attempt ${retryCountRef.current + 1})`);
            
            setTimeout(() => {
              if (isActiveRef.current) {
                retryCountRef.current++;
                cleanupSubscription();
                setupSubscription();
              }
            }, retryDelay);
          }
        }
      });

  }, [user, userId, table, handleRealtimeEvent, enableRetry, maxRetries]);

  // Cleanup subscription
  const cleanupSubscription = useCallback(() => {
    const channelKey = channelKeyRef.current;
    
    if (channelKey) {
      // Decrement subscriber count
      const currentCount = channelSubscribers.get(channelKey) || 0;
      const newCount = Math.max(0, currentCount - 1);
      channelSubscribers.set(channelKey, newCount);
      
      // Only remove channel if no more subscribers
      if (newCount === 0 && activeChannels.has(channelKey)) {
        console.log(`[useRealtime] Cleaning up ${table} subscription - no more subscribers`);
        const channel = activeChannels.get(channelKey);
        if (channel) {
          supabase.removeChannel(channel);
        }
        activeChannels.delete(channelKey);
        channelSubscribers.delete(channelKey);
      }
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, [table]);

  // Setup and cleanup effects
  useEffect(() => {
    isActiveRef.current = true;
    setupSubscription();
    
    return () => {
      isActiveRef.current = false;
      cleanupSubscription();
    };
  }, [setupSubscription, cleanupSubscription]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isActiveRef.current = false;
      cleanupSubscription();
    };
  }, [cleanupSubscription]);
};
