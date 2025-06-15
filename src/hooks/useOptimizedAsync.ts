
import { useState, useCallback, useRef } from 'react';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface AsyncOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  showErrorToast?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

export const useOptimizedAsync = <T>() => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  });
  
  const { handleError, handleSuccess } = useErrorHandler();
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const execute = useCallback(async (
    asyncFunction: (signal?: AbortSignal) => Promise<T>,
    options: AsyncOptions = {}
  ): Promise<T | null> => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear any pending retry
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const executeWithRetry = async (attempt = 1): Promise<T | null> => {
      try {
        const result = await asyncFunction(abortController.signal);
        
        // Only update state if not aborted
        if (!abortController.signal.aborted) {
          setState({ data: result, loading: false, error: null });
          
          if (options.onSuccess) {
            options.onSuccess(result);
          }
        }
        
        return result;
      } catch (error: any) {
        // Don't handle aborted requests
        if (error.name === 'AbortError' || abortController.signal.aborted) {
          return null;
        }

        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        
        // Retry logic
        const maxRetries = options.retryCount || 0;
        if (attempt <= maxRetries) {
          const delay = options.retryDelay || 1000 * attempt; // Exponential backoff
          
          return new Promise((resolve) => {
            retryTimeoutRef.current = setTimeout(async () => {
              const result = await executeWithRetry(attempt + 1);
              resolve(result);
            }, delay);
          });
        }
        
        // Final error handling
        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
        
        if (options.showErrorToast !== false) {
          handleError(error);
        }
        
        if (options.onError) {
          options.onError(errorMessage);
        }
        
        return null;
      }
    };

    return executeWithRetry();
  }, [handleError]);

  const reset = useCallback(() => {
    // Cancel any pending operations
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    
    setState({ data: null, loading: false, error: null });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

  return {
    ...state,
    execute,
    reset,
    clearError,
    cleanup
  };
};
