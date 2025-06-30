import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Clean, simple real-time hook that avoids duplicate subscriptions
 * Creates one subscription per table/user combination
 */
export const useCleanRealtime = (
  table: string,
  userId: string | null,
  onUpdate: (payload: any) => void
) => {
  const channelRef = useRef<any>(null);
  const handlerRef = useRef(onUpdate);

  // Keep handler reference up to date
  useEffect(() => {
    handlerRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (!userId) return;

    // Clean up any existing channel first
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Create a unique channel name to avoid conflicts
    const channelName = `${table}_${userId}_${Date.now()}`;
    
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
        (payload) => {
          if (handlerRef.current) {
            handlerRef.current(payload);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, userId]);
};
