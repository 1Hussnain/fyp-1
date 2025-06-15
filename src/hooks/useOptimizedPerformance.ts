import { useEffect, useCallback, useRef } from "react";

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  componentName: string;
}

export const useOptimizedPerformance = (componentName: string) => {
  const renderStartTime = useRef<number>(performance.now());
  const metricsRef = useRef<PerformanceMetrics[]>([]);

  useEffect(() => {
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    
    const metrics: PerformanceMetrics = {
      renderTime,
      componentName,
      memoryUsage: (performance as any).memory?.usedJSHeapSize
    };

    metricsRef.current.push(metrics);

    // Log slow renders (>16ms for 60fps)
    if (renderTime > 16) {
      console.warn(`[Performance] Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }

    // Keep only last 100 metrics to prevent memory leaks
    if (metricsRef.current.length > 100) {
      metricsRef.current = metricsRef.current.slice(-50);
    }
  });

  const measureOperation = useCallback(async <T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await operation();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (duration > 100) {
        console.warn(`[Performance] Slow operation in ${componentName}.${operationName}: ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.error(`[Performance] Failed operation in ${componentName}.${operationName}: ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }, [componentName]);

  const getMetrics = useCallback(() => ({
    averageRenderTime: metricsRef.current.reduce((acc, m) => acc + m.renderTime, 0) / metricsRef.current.length,
    maxRenderTime: Math.max(...metricsRef.current.map(m => m.renderTime)),
    totalRenders: metricsRef.current.length
  }), []);

  // Reset start time for next render
  renderStartTime.current = performance.now();

  return { measureOperation, getMetrics };
};
