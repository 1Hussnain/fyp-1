
/**
 * Error handling and retry logic for realtime subscriptions
 */

import { Table, SubscriptionInfo } from "@/types/realtime";

export class RealtimeErrorHandler {
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second base delay

  /**
   * Handle subscription errors with exponential backoff retry logic
   * @param table - Database table name
   * @param key - Unique subscription key
   * @param subscription - Subscription info object
   * @param createSubscriptionFn - Function to recreate the subscription
   */
  handleSubscriptionError(
    table: Table,
    key: string,
    subscription: SubscriptionInfo,
    createSubscriptionFn: () => void
  ) {
    if (subscription.retryCount < this.maxRetries) {
      subscription.retryCount++;
      const delay = this.retryDelay * subscription.retryCount;
      
      console.warn(
        `[RealtimeErrorHandler] Retrying ${table} subscription (${subscription.retryCount}/${this.maxRetries}) in ${delay}ms`
      );

      setTimeout(() => {
        createSubscriptionFn();
      }, delay);
    } else {
      console.error(`[RealtimeErrorHandler] Max retries reached for ${table} subscription`);
    }
  }

  /**
   * Handle errors in individual update handlers
   * @param table - Database table name
   * @param error - Error that occurred
   */
  handleHandlerError(table: Table, error: any) {
    console.error(`[RealtimeErrorHandler] Error in handler for ${table}:`, error);
  }
}
