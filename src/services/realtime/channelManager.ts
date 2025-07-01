
/**
 * Channel creation and management for realtime subscriptions
 */

import { supabase } from "@/integrations/supabase/client";
import { Table, SubscriptionInfo, UpdateHandler } from "@/types/realtime";
import { RealtimeErrorHandler } from "./errorHandler";

export class RealtimeChannelManager {
  private errorHandler = new RealtimeErrorHandler();

  /**
   * Create a new Supabase channel subscription
   * @param table - Database table name
   * @param key - Unique subscription key
   * @param subscription - Subscription info object
   */
  createSubscription(table: Table, key: string, subscription: SubscriptionInfo) {
    try {
      console.log(`[RealtimeChannelManager] Creating channel for ${table}`);

      // Create unique channel name to avoid conflicts
      const channelName = `${table}-realtime-${subscription.userId}-${Date.now()}`;

      subscription.channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
            schema: 'public',
            table,
            filter: `user_id=eq.${subscription.userId}`
          },
          (payload) => {
            // Add type safety for payload data with proper casting
            const recordId = (payload.new as any)?.id || (payload.old as any)?.id || 'unknown';
            console.log(`[RealtimeChannelManager] ${table} update:`, payload.eventType, recordId);
            
            // Broadcast to all handlers for this subscription
            subscription.handlers.forEach(handler => {
              try {
                handler(payload);
              } catch (error) {
                this.errorHandler.handleHandlerError(table, error);
              }
            });
          }
        )
        .subscribe((status) => {
          console.log(`[RealtimeChannelManager] ${table} subscription status:`, status);
          
          if (status === 'SUBSCRIBED') {
            subscription.isActive = true;
            subscription.retryCount = 0;
          } else if (status === 'CHANNEL_ERROR') {
            subscription.isActive = false;
            this.errorHandler.handleSubscriptionError(
              table,
              key,
              subscription,
              () => this.createSubscription(table, key, subscription)
            );
          }
        });

    } catch (error) {
      console.error(`[RealtimeChannelManager] Error creating subscription for ${table}:`, error);
      subscription.isActive = false;
    }
  }

  /**
   * Clean up a subscription channel
   * @param subscription - Subscription info object
   */
  cleanupChannel(subscription: SubscriptionInfo) {
    if (subscription.channel) {
      supabase.removeChannel(subscription.channel);
    }
  }
}
