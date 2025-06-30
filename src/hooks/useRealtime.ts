
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Global registry to prevent duplicate subscriptions
const activeChannels = new Map<string, RealtimeChannel>();

export const useRealtime = (
  table: string,
  userId: string | null,
  onUpdate: (payload: any) => void
) => {
  const handlerRef = useRef(onUpdate);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isSubscribedRef = useRef(false);

  // Update handler ref when callback changes
  useEffect(() => {
    handlerRef.current = onUpdate;
  }, [onUpdate]);

  const handleRealtimeUpdate = useCallback((payload: any) => {
    console.log(`[useRealtime] ${table} update:`, payload);
    if (handlerRef.current) {
      handlerRef.current(payload);
    }
  }, [table]);

  useEffect(() => {
    if (!userId || isSubscribedRef.current) {
      return;
    }

    const channelKey = `${table}_${userId}`;
    console.log(`[useRealtime] Setting up ${table} subscription`);

    // Check if channel already exists
    let channel = activeChannels.get(channelKey);
    
    if (!channel) {
      // Create new channel only if it doesn't exist
      channel = supabase.channel(`realtime_${table}_${userId}`);
      
      channel
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
            filter: `user_id=eq.${userId}`
          },
          handleRealtimeUpdate
        )
        .subscribe((status) => {
          console.log(`[useRealtime] ${table} status:`, status);
        });

      activeChannels.set(channelKey, channel);
    }

    channelRef.current = channel;
    isSubscribedRef.current = true;

    return () => {
      console.log(`[useRealtime] Cleaning up ${table} subscription`);
      isSubscribedRef.current = false;
      
      if (channelRef.current) {
        const channelKey = `${table}_${userId}`;
        channelRef.current.unsubscribe();
        activeChannels.delete(channelKey);
        channelRef.current = null;
      }
    };
  }, [userId, table, handleRealtimeUpdate]);
};
