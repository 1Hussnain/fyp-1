
/**
 * Centralized Realtime Subscription Manager
 * 
 * This service manages all Supabase realtime subscriptions to prevent:
 * - Duplicate subscriptions to the same table
 * - Memory leaks from improper cleanup
 * - State synchronization issues
 * - Performance problems from multiple connections
 * 
 * Features:
 * - Single subscription per table across the entire app
 * - Event broadcasting to multiple listeners
 * - Automatic reference counting and cleanup
 * - Error recovery and retry logic
 * - Debug logging for troubleshooting
 */

import { supabase } from "@/integrations/supabase/client";

// Type definitions for the subscription manager
type Table = "transactions" | "financial_goals" | "budgets" | "categories";
type EventType = "INSERT" | "UPDATE" | "DELETE";
type UpdateHandler<T> = (payload: any) => void;

interface SubscriptionInfo {
  channel: any; // Supabase channel instance
  handlers: Set<UpdateHandler<any>>; // Set of callback functions
  userId: string; // User ID for filtering
  isActive: boolean; // Whether subscription is currently active
  retryCount: number; // Number of retry attempts
}

/**
 * Centralized manager for all realtime subscriptions
 * Implements singleton pattern to ensure only one instance exists
 */
class RealtimeSubscriptionManager {
  private static instance: RealtimeSubscriptionManager;
  private subscriptions: Map<string, SubscriptionInfo> = new Map();
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second base delay

  /**
   * Get the singleton instance of the subscription manager
   */
  static getInstance(): RealtimeSubscriptionManager {
    if (!RealtimeSubscriptionManager.instance) {
      RealtimeSubscriptionManager.instance = new RealtimeSubscriptionManager();
    }
    return RealtimeSubscriptionManager.instance;
  }

  /**
   * Subscribe to a table with automatic deduplication
   * @param table - Database table to subscribe to
   * @param userId - User ID for filtering data
   * @param handler - Callback function to handle updates
   * @returns Cleanup function to unsubscribe
   */
  subscribe<T>(
    table: Table,
    userId: string,
    handler: UpdateHandler<T>
  ): () => void {
    const key = `${table}-${userId}`;
    
    console.log(`[RealtimeManager] Subscribing to ${table} for user ${userId}`);

    // Get or create subscription info
    let subscription = this.subscriptions.get(key);
    
    if (!subscription) {
      // Create new subscription if it doesn't exist
      subscription = {
        channel: null,
        handlers: new Set(),
        userId,
        isActive: false,
        retryCount: 0
      };
      this.subscriptions.set(key, subscription);
    }

    // Add the handler to the set of listeners
    subscription.handlers.add(handler);

    // Create the actual Supabase subscription if not already active
    if (!subscription.isActive) {
      this.createSubscription(table, key, subscription);
    }

    // Return cleanup function
    return () => this.unsubscribe(table, userId, handler);
  }

  /**
   * Create the actual Supabase channel subscription
   * @param table - Database table name
   * @param key - Unique key for this subscription
   * @param subscription - Subscription info object
   */
  private createSubscription(table: Table, key: string, subscription: SubscriptionInfo) {
    try {
      console.log(`[RealtimeManager] Creating channel for ${table}`);

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
            // Add type safety for payload data
            const recordId = payload.new?.id || payload.old?.id || 'unknown';
            console.log(`[RealtimeManager] ${table} update:`, payload.eventType, recordId);
            
            // Broadcast to all handlers for this subscription
            subscription.handlers.forEach(handler => {
              try {
                handler(payload);
              } catch (error) {
                console.error(`[RealtimeManager] Error in handler for ${table}:`, error);
              }
            });
          }
        )
        .subscribe((status) => {
          console.log(`[RealtimeManager] ${table} subscription status:`, status);
          
          if (status === 'SUBSCRIBED') {
            subscription.isActive = true;
            subscription.retryCount = 0;
          } else if (status === 'CHANNEL_ERROR') {
            subscription.isActive = false;
            this.handleSubscriptionError(table, key, subscription);
          }
        });

    } catch (error) {
      console.error(`[RealtimeManager] Error creating subscription for ${table}:`, error);
      subscription.isActive = false;
    }
  }

  /**
   * Handle subscription errors with retry logic
   * @param table - Database table name
   * @param key - Unique subscription key
   * @param subscription - Subscription info object
   */
  private handleSubscriptionError(table: Table, key: string, subscription: SubscriptionInfo) {
    if (subscription.retryCount < this.maxRetries) {
      subscription.retryCount++;
      const delay = this.retryDelay * subscription.retryCount;
      
      console.warn(
        `[RealtimeManager] Retrying ${table} subscription (${subscription.retryCount}/${this.maxRetries}) in ${delay}ms`
      );

      setTimeout(() => {
        this.createSubscription(table, key, subscription);
      }, delay);
    } else {
      console.error(`[RealtimeManager] Max retries reached for ${table} subscription`);
    }
  }

  /**
   * Unsubscribe a specific handler from a table
   * @param table - Database table name
   * @param userId - User ID
   * @param handler - Handler function to remove
   */
  private unsubscribe<T>(table: Table, userId: string, handler: UpdateHandler<T>) {
    const key = `${table}-${userId}`;
    const subscription = this.subscriptions.get(key);

    if (!subscription) {
      return;
    }

    // Remove the handler
    subscription.handlers.delete(handler);
    console.log(`[RealtimeManager] Removed handler for ${table}, ${subscription.handlers.size} remaining`);

    // If no more handlers, cleanup the subscription
    if (subscription.handlers.size === 0) {
      this.cleanupSubscription(key, subscription);
    }
  }

  /**
   * Clean up a subscription completely
   * @param key - Subscription key
   * @param subscription - Subscription info object
   */
  private cleanupSubscription(key: string, subscription: SubscriptionInfo) {
    console.log(`[RealtimeManager] Cleaning up subscription ${key}`);

    if (subscription.channel) {
      supabase.removeChannel(subscription.channel);
    }

    subscription.isActive = false;
    this.subscriptions.delete(key);
  }

  /**
   * Get debug information about active subscriptions
   * @returns Object with subscription statistics
   */
  getDebugInfo() {
    const info = {
      totalSubscriptions: this.subscriptions.size,
      activeSubscriptions: 0,
      subscriptionDetails: [] as any[]
    };

    this.subscriptions.forEach((subscription, key) => {
      if (subscription.isActive) {
        info.activeSubscriptions++;
      }

      info.subscriptionDetails.push({
        key,
        isActive: subscription.isActive,
        handlerCount: subscription.handlers.size,
        retryCount: subscription.retryCount
      });
    });

    return info;
  }

  /**
   * Force cleanup all subscriptions (useful for testing or cleanup)
   */
  cleanup() {
    console.log('[RealtimeManager] Forcing cleanup of all subscriptions');
    
    this.subscriptions.forEach((subscription, key) => {
      this.cleanupSubscription(key, subscription);
    });
  }
}

// Export singleton instance
export const realtimeManager = RealtimeSubscriptionManager.getInstance();
