
import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  componentName: string;
}

export const usePerformanceOptimized = (componentName: string) => {
  const startTime = performance.now();

  useEffect(() => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
    }

    // Report slow components
    if (loadTime > 100) {
      console.warn(`[Performance] Slow component detected: ${componentName} took ${loadTime.toFixed(2)}ms`);
    }
  }, [componentName, startTime]);

  const measureAsync = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const opStartTime = performance.now();
    try {
      const result = await asyncOperation();
      const opEndTime = performance.now();
      const duration = opEndTime - opStartTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${operationName} completed in ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const opEndTime = performance.now();
      const duration = opEndTime - opStartTime;
      console.error(`[Performance] ${operationName} failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }, []);

  return { measureAsync };
};
