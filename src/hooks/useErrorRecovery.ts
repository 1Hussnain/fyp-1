
/**
 * Error Recovery Hook
 * 
 * Provides fault tolerance and recovery mechanisms:
 * - Automatic retry logic with exponential backoff
 * - Error boundary integration
 * - Graceful degradation strategies
 * - User-friendly error reporting
 */

import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

interface ErrorRecoveryState {
  isRetrying: boolean;
  attemptCount: number;
  lastError: Error | null;
  canRetry: boolean;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2
};

/**
 * Hook for implementing error recovery and retry logic
 * @param config - Retry configuration options
 * @returns Object with retry functions and error state
 */
export function useErrorRecovery(config: Partial<RetryConfig> = {}) {
  const { toast } = useToast();
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  
  const [errorState, setErrorState] = useState<ErrorRecoveryState>({
    isRetrying: false,
    attemptCount: 0,
    lastError: null,
    canRetry: true
  });

  const timeoutRef = useRef<NodeJS.Timeout>();

  /**
   * Execute an operation with automatic retry logic
   * @param operation - Async operation to execute
   * @param operationName - Name for logging and user feedback
   * @returns Promise with operation result
   */
  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string = 'Operation'
  ): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
      try {
        setErrorState(prev => ({
          ...prev,
          isRetrying: attempt > 1,
          attemptCount: attempt
        }));

        const result = await operation();
        
        // Success - reset error state
        setErrorState({
          isRetrying: false,
          attemptCount: 0,
          lastError: null,
          canRetry: true
        });

        if (attempt > 1) {
          toast({
            title: "Success",
            description: `${operationName} succeeded after ${attempt} attempts`,
          });
        }

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt < retryConfig.maxAttempts) {
          const delay = Math.min(
            retryConfig.baseDelay * Math.pow(retryConfig.backoffMultiplier, attempt - 1),
            retryConfig.maxDelay
          );

          console.warn(`[ErrorRecovery] ${operationName} failed, retrying in ${delay}ms (attempt ${attempt}/${retryConfig.maxAttempts})`);
          
          await new Promise(resolve => {
            timeoutRef.current = setTimeout(resolve, delay);
          });
        }
      }
    }

    // All attempts failed
    setErrorState({
      isRetrying: false,
      attemptCount: retryConfig.maxAttempts,
      lastError: lastError!,
      canRetry: false
    });

    toast({
      title: "Operation Failed",
      description: `${operationName} failed after ${retryConfig.maxAttempts} attempts: ${lastError!.message}`,
      variant: "destructive",
    });

    throw lastError!;
  }, [retryConfig, toast]);

  /**
   * Manual retry function for user-initiated retries
   */
  const manualRetry = useCallback((operation: () => Promise<any>, operationName?: string) => {
    setErrorState(prev => ({ ...prev, canRetry: true, attemptCount: 0 }));
    return executeWithRetry(operation, operationName);
  }, [executeWithRetry]);

  /**
   * Reset error state
   */
  const resetError = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setErrorState({
      isRetrying: false,
      attemptCount: 0,
      lastError: null,
      canRetry: true
    });
  }, []);

  return {
    executeWithRetry,
    manualRetry,
    resetError,
    errorState,
    isRetrying: errorState.isRetrying
  };
}
