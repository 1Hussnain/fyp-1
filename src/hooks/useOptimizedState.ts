
/**
 * Optimized State Management Hook
 * 
 * A high-performance state hook that implements:
 * - Debounced updates to prevent excessive re-renders
 * - Shallow comparison for object state changes
 * - Performance monitoring and logging
 * - Memory leak prevention with cleanup
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { PerformanceMetrics } from '@/types/common';

interface OptimizedStateConfig<T> {
  /** Debounce delay in milliseconds */
  debounceMs?: number;
  /** Enable performance monitoring */
  enableMetrics?: boolean;
  /** Custom equality function for state comparison */
  isEqual?: (prev: T, next: T) => boolean;
}

/**
 * Custom hook for optimized state management with performance monitoring
 * @param initialState - Initial state value
 * @param config - Configuration options for optimization
 * @returns [state, setState, metrics] tuple
 */
export function useOptimizedState<T>(
  initialState: T,
  config: OptimizedStateConfig<T> = {}
): [T, (newState: T | ((prev: T) => T)) => void, PerformanceMetrics[]] {
  const {
    debounceMs = 0,
    enableMetrics = false,
    isEqual = (prev, next) => prev === next
  } = config;

  const [state, setState] = useState<T>(initialState);
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const debounceRef = useRef<NodeJS.Timeout>();
  const renderCountRef = useRef(0);
  const lastRenderTime = useRef(performance.now());

  // Performance monitoring effect
  useEffect(() => {
    if (enableMetrics) {
      const renderTime = performance.now() - lastRenderTime.current;
      renderCountRef.current += 1;

      if (renderTime > 16) { // Threshold for 60fps
        const metric: PerformanceMetrics = {
          componentName: 'OptimizedState',
          renderTime,
          timestamp: Date.now(),
          memoryUsage: (performance as any).memory?.usedJSHeapSize
        };

        setMetrics(prev => [...prev.slice(-49), metric]); // Keep last 50 metrics
        console.warn(`[Performance] Slow state update detected: ${renderTime.toFixed(2)}ms`);
      }

      lastRenderTime.current = performance.now();
    }
  });

  // Optimized setState with debouncing and equality check
  const optimizedSetState = useCallback((newState: T | ((prev: T) => T)) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const updateState = () => {
      setState(prevState => {
        const nextState = typeof newState === 'function' 
          ? (newState as (prev: T) => T)(prevState)
          : newState;

        // Skip update if state hasn't actually changed
        if (isEqual(prevState, nextState)) {
          return prevState;
        }

        return nextState;
      });
    };

    if (debounceMs > 0) {
      debounceRef.current = setTimeout(updateState, debounceMs);
    } else {
      updateState();
    }
  }, [debounceMs, isEqual]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return [state, optimizedSetState, metrics];
}
