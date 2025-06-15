
/**
 * Type definitions for the realtime subscription system
 */

// Database table types that support realtime subscriptions
export type Table = "transactions" | "financial_goals" | "budgets" | "categories";

// Supabase realtime event types
export type EventType = "INSERT" | "UPDATE" | "DELETE";

// Generic update handler function type
export type UpdateHandler<T> = (payload: any) => void;

/**
 * Information about an active subscription
 */
export interface SubscriptionInfo {
  channel: any; // Supabase channel instance
  handlers: Set<UpdateHandler<any>>; // Set of callback functions
  userId: string; // User ID for filtering
  isActive: boolean; // Whether subscription is currently active
  retryCount: number; // Number of retry attempts
}

/**
 * Debug information for subscription monitoring
 */
export interface DebugInfo {
  totalSubscriptions: number;
  activeSubscriptions: number;
  subscriptionDetails: Array<{
    key: string;
    isActive: boolean;
    handlerCount: number;
    retryCount: number;
  }>;
}
