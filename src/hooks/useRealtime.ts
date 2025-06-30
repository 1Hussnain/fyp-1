
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Table = "transactions" | "financial_goals" | "budgets" | "categories";

export function useRealtime<T>(
  table: Table,
  userId: string | null,
  onUpdate: (payload: any) => void
) {
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) return;

    console.log(`[useRealtime] Setting up subscription for ${table}`);

    const channelName = `${table}_${userId}_${Date.now()}`;
    
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
          console.log(`[useRealtime] ${table} update:`, payload.eventType);
          onUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        console.log(`[useRealtime] Cleaning up ${table} subscription`);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, userId]);
}
