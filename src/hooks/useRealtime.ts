
/**
 * Enhanced Realtime Hook with Advanced Configuration
 * 
 * This hook provides a comprehensive interface to the centralized realtime subscription manager
 * with advanced features like debouncing, retry logic, and connection management.
 */

import { useEffect, useRef, useCallback } from 'react';
import { realtimeManager } from '@/services/realtime';

type Table = "transactions" | "financial_goals" | "budgets" | "categories";
type UpdateHandler<T> = (payload: any) => void;

interface RealtimeOptions {
  enableDebounce?: boolean;
  debounceMs?: number;
  enableRetry?: boolean;
  maxRetries?: number;
  onConnectionChange?: (connected: boolean) => void;
  onError?: (error: Error) => void;
}

/**
 * Enhanced hook for real-time subscriptions with advanced features
 * @param table - Database table to subscribe to
 * @param userId - User ID for filtering (null = no subscription)
 * @param handler - Function to handle realtime updates
 * @param options - Advanced configuration options
 */
export function useRealtime<T>(
  table: Table,
  userId: string | null,
  handler: UpdateHandler<T>,
  options: RealtimeOptions = {}
) {
  const cleanupRef = useRef<(() => void) | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  
  const {
    enableDebounce = false,
    debounceMs = 300,
    enableRetry = false,
    maxRetries = 3,
    onConnectionChange,
    onError
  } = options;

  // Debounced handler wrapper
  const debouncedHandler = useCallback((payload: any) => {
    if (enableDebounce) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        handler(payload);
      }, debounceMs);
    } else {
      handler(payload);
    }
  }, [handler, enableDebounce, debounceMs]);

  // Enhanced handler with retry logic
  const enhancedHandler = useCallback((payload: any) => {
    try {
      debouncedHandler(payload);
      retryCountRef.current = 0; // Reset retry count on success
      onConnectionChange?.(true);
    } catch (error) {
      console.error(`[useRealtime] Error handling ${table} update:`, error);
      onError?.(error as Error);
      
      if (enableRetry && retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        setTimeout(() => {
          console.log(`[useRealtime] Retrying ${table} update (attempt ${retryCountRef.current})`);
          try {
            debouncedHandler(payload);
          } catch (retryError) {
            console.error(`[useRealtime] Retry failed for ${table}:`, retryError);
          }
        }, 1000 * retryCountRef.current); // Exponential backoff
      } else {
        onConnectionChange?.(false);
      }
    }
  }, [debouncedHandler, table, enableRetry, maxRetries, onConnectionChange, onError]);

  useEffect(() => {
    // Don't subscribe if no user ID
    if (!userId) {
      onConnectionChange?.(false);
      return;
    }

    console.log(`[useRealtime] Setting up enhanced subscription for ${table} with options:`, options);

    try {
      // Subscribe through the centralized manager
      cleanupRef.current = realtimeManager.subscribe(table, userId, enhancedHandler);
      onConnectionChange?.(true);
    } catch (error) {
      console.error(`[useRealtime] Failed to set up subscription for ${table}:`, error);
      onError?.(error as Error);
      onConnectionChange?.(false);
    }

    // Cleanup function
    return () => {
      if (cleanupRef.current) {
        console.log(`[useRealtime] Cleaning up enhanced subscription for ${table}`);
        cleanupRef.current();
        cleanupRef.current = null;
      }
      
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      
      onConnectionChange?.(false);
    };
  }, [table, userId, enhancedHandler, onConnectionChange, onError]);

  // Additional cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);
}

/**
 * Hook to get realtime connection debug information
 */
export function useRealtimeDebugInfo() {
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDebugInfo(realtimeManager.getDebugInfo());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return debugInfo;
}
