
/**
 * Core subscription management logic
 */

import { Table, SubscriptionInfo, UpdateHandler, DebugInfo } from "@/types/realtime";
import { RealtimeChannelManager } from "./channelManager";

/**
 * Centralized manager for all realtime subscriptions
 * Implements singleton pattern to ensure only one instance exists
 */
export class RealtimeSubscriptionManager {
  private static instance: RealtimeSubscriptionManager;
  private subscriptions: Map<string, SubscriptionInfo> = new Map();
  private channelManager = new RealtimeChannelManager();

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
    
    console.log(`[RealtimeSubscriptionManager] Subscribing to ${table} for user ${userId}`);

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
      this.channelManager.createSubscription(table, key, subscription);
    }

    // Return cleanup function
    return () => this.unsubscribe(table, userId, handler);
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
    console.log(`[RealtimeSubscriptionManager] Removed handler for ${table}, ${subscription.handlers.size} remaining`);

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
    console.log(`[RealtimeSubscriptionManager] Cleaning up subscription ${key}`);

    this.channelManager.cleanupChannel(subscription);
    subscription.isActive = false;
    this.subscriptions.delete(key);
  }

  /**
   * Get debug information about active subscriptions
   * @returns Object with subscription statistics
   */
  getDebugInfo(): DebugInfo {
    const info: DebugInfo = {
      totalSubscriptions: this.subscriptions.size,
      activeSubscriptions: 0,
      subscriptionDetails: []
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
    console.log('[RealtimeSubscriptionManager] Forcing cleanup of all subscriptions');
    
    this.subscriptions.forEach((subscription, key) => {
      this.cleanupSubscription(key, subscription);
    });
  }
}
