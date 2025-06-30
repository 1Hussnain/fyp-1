
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Global channel registry to prevent duplicate subscriptions
const channelRegistry = new Map<string, RealtimeChannel>();

export const useSimpleRealtime = (
  table: string,
  userId: string | null,
  onUpdate: (payload: any) => void
) => {
  const handlerRef = useRef(onUpdate);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Update handler ref when it changes
  useEffect(() => {
    handlerRef.current = onUpdate;
  }, [onUpdate]);

  const handleRealtimeUpdate = useCallback((payload: any) => {
    if (handlerRef.current) {
      handlerRef.current(payload);
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      console.log(`[useSimpleRealtime] No user ID for ${table}, skipping subscription`);
      return;
    }

    const channelKey = `${table}_${userId}`;
    console.log(`[useSimpleRealtime] Setting up ${table} subscription for user ${userId}`);

    // Check if channel already exists
    let channel = channelRegistry.get(channelKey);
    
    if (!channel) {
      // Create new channel
      channel = supabase
        .channel(`${table}_changes_${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
            filter: `user_id=eq.${userId}`
          },
          handleRealtimeUpdate
        );

      // Subscribe to the channel
      channel.subscribe((status) => {
        console.log(`[useSimpleRealtime] ${table} status:`, status);
      });

      // Store in registry
      channelRegistry.set(channelKey, channel);
    }

    channelRef.current = channel;

    return () => {
      console.log(`[useSimpleRealtime] Cleaning up ${table} subscription`);
      
      if (channelRef.current) {
        const channelKey = `${table}_${userId}`;
        channelRef.current.unsubscribe();
        channelRegistry.delete(channelKey);
        console.log(`[useSimpleRealtime] ${table} status: CLOSED`);
      }
    };
  }, [userId, table, handleRealtimeUpdate]);

  return channelRef.current;
};
