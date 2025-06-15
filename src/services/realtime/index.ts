
/**
 * Main exports for the realtime subscription system
 */

export { RealtimeSubscriptionManager } from "./subscriptionManager";
export { RealtimeChannelManager } from "./channelManager";
export { RealtimeErrorHandler } from "./errorHandler";

// Export singleton instance for use throughout the application
import { RealtimeSubscriptionManager } from "./subscriptionManager";
export const realtimeManager = RealtimeSubscriptionManager.getInstance();
