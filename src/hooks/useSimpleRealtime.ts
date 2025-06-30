
/**
 * Simplified Realtime Hook
 * 
 * A clean, simple approach to real-time subscriptions that avoids
 * the complexity and multiple subscription issues in the current system.
 */

import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Table = "transactions" | "financial_goals" | "budgets" | "categories";

/**
 * Simple hook for subscribing to realtime updates
 * @param table - Database table to subscribe to
 * @param userId - User ID for filtering (null = no subscription)
 * @param onUpdate - Function to handle realtime updates
 */
export function useSimpleRealtime<T>(
  table: Table,
  userId: string | null,
  onUpdate: (payload: any) => void
) {
  const channelRef = useRef<any>(null);

  useEffect(() => {
    // Don't subscribe if no user ID
    if (!userId) {
      return;
    }

    console.log(`[useSimpleRealtime] Setting up subscription for ${table}`);

    // Create a unique channel name
    const channelName = `${table}_${userId}_${Date.now()}`;
    
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
          console.log(`[useSimpleRealtime] ${table} update:`, payload);
          onUpdate(payload);
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      if (channelRef.current) {
        console.log(`[useSimpleRealtime] Cleaning up subscription for ${table}`);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, userId, onUpdate]);
}
