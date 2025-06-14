
import { useEffect, useCallback } from "react";

export const usePerformanceMonitor = (componentName: string) => {
  const logPerformance = useCallback((action: string, startTime: number) => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (duration > 100) { // Log slow operations (>100ms)
      console.warn(`[Performance] ${componentName} - ${action}: ${duration.toFixed(2)}ms`);
    }
  }, [componentName]);

  const measureAsync = useCallback(async <T>(action: string, asyncFn: () => Promise<T>): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await asyncFn();
      logPerformance(action, startTime);
      return result;
    } catch (error) {
      logPerformance(`${action} (failed)`, startTime);
      throw error;
    }
  }, [logPerformance]);

  const measureSync = useCallback(<T>(action: string, syncFn: () => T): T => {
    const startTime = performance.now();
    try {
      const result = syncFn();
      logPerformance(action, startTime);
      return result;
    } catch (error) {
      logPerformance(`${action} (failed)`, startTime);
      throw error;
    }
  }, [logPerformance]);

  return { measureAsync, measureSync };
};
