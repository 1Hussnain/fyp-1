
/**
 * Ultra-Simple Realtime Hook
 * 
 * Completely rewritten to avoid all subscription conflicts and complexity.
 * One subscription per hook instance, automatic cleanup, no shared state.
 */

import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Table = "transactions" | "financial_goals" | "budgets" | "categories";

/**
 * Simple, conflict-free hook for subscribing to realtime updates
 */
export function useSimpleRealtime<T>(
  table: Table,
  userId: string | null,
  onUpdate: (payload: any) => void
) {
  const channelRef = useRef<any>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Clear any existing subscription first
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    // Don't subscribe if no user ID
    if (!userId) {
      return;
    }

    console.log(`[useSimpleRealtime] Creating fresh subscription for ${table}`);

    // Create a truly unique channel name with timestamp and random number
    const channelName = `${table}_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Create channel and subscribe
      channelRef.current = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            console.log(`[useSimpleRealtime] ${table} update:`, payload.eventType);
            try {
              onUpdate(payload);
            } catch (error) {
              console.error(`[useSimpleRealtime] Error in update handler:`, error);
            }
          }
        )
        .subscribe((status) => {
          console.log(`[useSimpleRealtime] ${table} status:`, status);
        });

      // Store cleanup function
      cleanupRef.current = () => {
        if (channelRef.current) {
          console.log(`[useSimpleRealtime] Cleaning up ${table} subscription`);
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
      };
    } catch (error) {
      console.error(`[useSimpleRealtime] Error creating subscription:`, error);
    }

    // Cleanup function
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [table, userId]); // Removed onUpdate from deps to prevent recreating subscriptions

  // Final cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);
}
