
/**
 * Optimized Query Hook
 * 
 * Enhanced version of useOptimizedQuery with:
 * - Advanced caching strategies with TTL
 * - Request deduplication to prevent duplicate API calls
 * - Stale-while-revalidate pattern for better UX
 * - Background refresh capabilities
 * - Comprehensive error handling with retry logic
 * - Memory management and cleanup
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useErrorRecovery } from './useErrorRecovery';
import { ApiResponse, CacheConfig } from '@/types/common';

interface QueryOptions<T> {
  /** Enable query execution */
  enabled?: boolean;
  /** Cache configuration */
  cacheConfig?: CacheConfig;
  /** Stale time in milliseconds */
  staleTime?: number;
  /** Background refetch interval */
  refetchInterval?: number;
  /** Retry configuration */
  retryConfig?: {
    maxAttempts: number;
    baseDelay: number;
  };
  /** Transform response data */
  select?: (data: T) => any;
  /** Callback on success */
  onSuccess?: (data: T) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

interface QueryState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isFetching: boolean;
  isStale: boolean;
  lastFetched: number | null;
}

// Global cache and request deduplication maps
const queryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
const pendingRequests = new Map<string, Promise<any>>();

/**
 * Advanced query hook with caching, deduplication, and optimizations
 * @param queryKey - Unique identifier for the query
 * @param queryFn - Function that returns a Promise with the data
 * @param options - Configuration options
 * @returns Query state and utility functions
 */
export function useOptimizedQuery<T>(
  queryKey: string,
  queryFn: () => Promise<ApiResponse<T>>,
  options: QueryOptions<T> = {}
) {
  const {
    enabled = true,
    cacheConfig = { ttl: 5 * 60 * 1000, maxSize: 100, strategy: 'lru' }, // 5 min default TTL
    staleTime = 0,
    refetchInterval,
    select,
    onSuccess,
    onError
  } = options;

  const [state, setState] = useState<QueryState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isFetching: false,
    isStale: false,
    lastFetched: null
  });

  const { executeWithRetry } = useErrorRecovery(options.retryConfig);
  const intervalRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);

  /**
   * Check if cached data is still valid
   */
  const isCacheValid = useCallback((cacheEntry: any) => {
    return Date.now() - cacheEntry.timestamp < cacheEntry.ttl;
  }, []);

  /**
   * Get data from cache if available and valid
   */
  const getCachedData = useCallback(() => {
    const cached = queryCache.get(queryKey);
    if (cached && isCacheValid(cached)) {
      return cached.data;
    }
    return null;
  }, [queryKey, isCacheValid]);

  /**
   * Cache management with LRU eviction
   */
  const setCacheData = useCallback((data: T) => {
    // Implement LRU eviction if cache is full
    if (queryCache.size >= cacheConfig.maxSize) {
      const oldestKey = Array.from(queryCache.keys())[0];
      queryCache.delete(oldestKey);
    }

    queryCache.set(queryKey, {
      data,
      timestamp: Date.now(),
      ttl: cacheConfig.ttl
    });
  }, [queryKey, cacheConfig]);

  /**
   * Execute the query with all optimizations
   */
  const executeQuery = useCallback(async (isBackground = false) => {
    // Don't execute if disabled or component unmounted
    if (!enabled || !mountedRef.current) return;

    // Check for existing pending request (deduplication)
    const existingRequest = pendingRequests.get(queryKey);
    if (existingRequest && !isBackground) {
      try {
        const result = await existingRequest;
        return result;
      } catch (error) {
        // Request failed, proceed with new request
      }
    }

    // Check cache first
    const cachedData = getCachedData();
    if (cachedData && !isBackground) {
      setState(prev => ({
        ...prev,
        data: select ? select(cachedData) : cachedData,
        isLoading: false,
        isStale: false,
        lastFetched: Date.now()
      }));
      
      if (onSuccess) {
        onSuccess(cachedData);
      }
      return cachedData;
    }

    // Set loading state
    setState(prev => ({
      ...prev,
      isLoading: !isBackground && !prev.data,
      isFetching: true,
      error: null
    }));

    // Create and cache the request promise
    const requestPromise = executeWithRetry(async () => {
      const response = await queryFn();
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Query failed');
      }

      return response.data;
    }, `Query: ${queryKey}`);

    pendingRequests.set(queryKey, requestPromise);

    try {
      const data = await requestPromise;
      
      if (!mountedRef.current) return;

      // Cache the successful response
      setCacheData(data);

      // Update state
      setState(prev => ({
        ...prev,
        data: select ? select(data) : data,
        error: null,
        isLoading: false,
        isFetching: false,
        isStale: false,
        lastFetched: Date.now()
      }));

      if (onSuccess) {
        onSuccess(data);
      }

      return data;
    } catch (error) {
      if (!mountedRef.current) return;

      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      setState(prev => ({
        ...prev,
        error: errorObj,
        isLoading: false,
        isFetching: false
      }));

      if (onError) {
        onError(errorObj);
      }

      throw errorObj;
    } finally {
      // Clean up pending request
      pendingRequests.delete(queryKey);
    }
  }, [enabled, queryKey, queryFn, getCachedData, setCacheData, select, onSuccess, onError, executeWithRetry]);

  /**
   * Manual refetch function
   */
  const refetch = useCallback(() => {
    return executeQuery(false);
  }, [executeQuery]);

  /**
   * Check if data is stale based on staleTime
   */
  const checkStaleStatus = useCallback(() => {
    if (state.lastFetched && staleTime > 0) {
      const isStale = Date.now() - state.lastFetched > staleTime;
      if (isStale !== state.isStale) {
        setState(prev => ({ ...prev, isStale }));
      }
    }
  }, [state.lastFetched, state.isStale, staleTime]);

  // Initial query execution
  useEffect(() => {
    if (enabled) {
      executeQuery();
    }
  }, [enabled, queryKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Background refetch interval
  useEffect(() => {
    if (refetchInterval && refetchInterval > 0) {
      intervalRef.current = setInterval(() => {
        executeQuery(true);
      }, refetchInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refetchInterval, executeQuery]);

  // Stale status checking
  useEffect(() => {
    checkStaleStatus();
    const staleCheckInterval = setInterval(checkStaleStatus, 1000);
    
    return () => clearInterval(staleCheckInterval);
  }, [checkStaleStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    ...state,
    refetch,
    isSuccess: !!state.data && !state.error,
    isError: !!state.error
  };
}

/**
 * Utility function to invalidate query cache
 */
export function invalidateQuery(queryKey: string) {
  queryCache.delete(queryKey);
}

/**
 * Utility function to clear all cached queries
 */
export function clearQueryCache() {
  queryCache.clear();
  pendingRequests.clear();
}
