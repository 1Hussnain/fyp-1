
/**
 * Enhanced Performance Monitoring Hook
 * 
 * Comprehensive performance monitoring with:
 * - Component render time tracking
 * - Memory usage monitoring
 * - FPS monitoring for smooth animations
 * - Bundle size impact analysis
 * - Network performance tracking
 * - User interaction latency measurement
 */

import { useEffect, useCallback, useRef, useState } from "react";

interface PerformanceConfig {
  /** Enable render time monitoring */
  trackRenderTime?: boolean;
  /** Enable memory usage tracking */
  trackMemory?: boolean;
  /** Enable FPS monitoring */
  trackFPS?: boolean;
  /** Enable network performance */
  trackNetwork?: boolean;
  /** Render time threshold for warnings (ms) */
  renderTimeThreshold?: number;
  /** Memory threshold for warnings (MB) */
  memoryThreshold?: number;
  /** Sample rate for monitoring (0-1) */
  sampleRate?: number;
}

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  memoryUsage?: number;
  fps?: number;
  networkLatency?: number;
  timestamp: number;
  userAgent: string;
}

const DEFAULT_CONFIG: Required<PerformanceConfig> = {
  trackRenderTime: true,
  trackMemory: true,
  trackFPS: false,
  trackNetwork: false,
  renderTimeThreshold: 16, // 60fps threshold
  memoryThreshold: 50, // 50MB threshold
  sampleRate: 1.0 // 100% sampling
};

/**
 * Enhanced performance monitoring hook with comprehensive metrics
 * @param componentName - Name of the component being monitored
 * @param config - Performance monitoring configuration
 * @returns Performance monitoring utilities and metrics
 */
export const usePerformanceMonitor = (componentName: string, config: PerformanceConfig = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const renderStartTime = useRef<number>(performance.now());
  const frameCount = useRef<number>(0);
  const fpsInterval = useRef<NodeJS.Timeout>();
  const networkStartTime = useRef<number>();

  /**
   * Log performance metric with sampling
   */
  const logMetric = useCallback((metric: PerformanceMetrics) => {
    if (Math.random() > finalConfig.sampleRate) return;

    setMetrics(prev => {
      const newMetrics = [...prev, metric].slice(-100); // Keep last 100 metrics
      
      // Log warnings for performance issues
      if (metric.renderTime > finalConfig.renderTimeThreshold) {
        console.warn(`[Performance] Slow render in ${componentName}: ${metric.renderTime.toFixed(2)}ms`);
      }
      
      if (metric.memoryUsage && metric.memoryUsage > finalConfig.memoryThreshold * 1024 * 1024) {
        console.warn(`[Performance] High memory usage in ${componentName}: ${(metric.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
      }

      return newMetrics;
    });
  }, [componentName, finalConfig]);

  /**
   * Measure async operation performance
   */
  const measureAsync = useCallback(async <T>(
    action: string, 
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now();
    networkStartTime.current = startTime;
    
    try {
      const result = await asyncFn();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      const metric: PerformanceMetrics = {
        componentName: `${componentName}.${action}`,
        renderTime: duration,
        networkLatency: duration,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        memoryUsage: finalConfig.trackMemory ? (performance as any).memory?.usedJSHeapSize : undefined
      };
      
      logMetric(metric);
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      const metric: PerformanceMetrics = {
        componentName: `${componentName}.${action} (failed)`,
        renderTime: duration,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      };
      
      logMetric(metric);
      throw error;
    }
  }, [componentName, finalConfig.trackMemory, logMetric]);

  /**
   * Measure synchronous operation performance
   */
  const measureSync = useCallback(<T>(action: string, syncFn: () => T): T => {
    const startTime = performance.now();
    
    try {
      const result = syncFn();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      const metric: PerformanceMetrics = {
        componentName: `${componentName}.${action}`,
        renderTime: duration,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        memoryUsage: finalConfig.trackMemory ? (performance as any).memory?.usedJSHeapSize : undefined
      };
      
      logMetric(metric);
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      const metric: PerformanceMetrics = {
        componentName: `${componentName}.${action} (failed)`,
        renderTime: duration,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      };
      
      logMetric(metric);
      throw error;
    }
  }, [componentName, finalConfig.trackMemory, logMetric]);

  /**
   * Start FPS monitoring
   */
  const startFPSMonitoring = useCallback(() => {
    if (!finalConfig.trackFPS) return;

    let lastTime = performance.now();
    frameCount.current = 0;

    const countFrame = () => {
      frameCount.current++;
      requestAnimationFrame(countFrame);
    };

    requestAnimationFrame(countFrame);

    fpsInterval.current = setInterval(() => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      const fps = (frameCount.current * 1000) / deltaTime;
      
      const metric: PerformanceMetrics = {
        componentName: `${componentName}.FPS`,
        renderTime: 0,
        fps: Math.round(fps),
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      };
      
      logMetric(metric);
      
      frameCount.current = 0;
      lastTime = currentTime;
    }, 1000); // Check FPS every second
  }, [componentName, finalConfig.trackFPS, logMetric]);

  /**
   * Get performance analytics
   */
  const getAnalytics = useCallback(() => {
    const componentMetrics = metrics.filter(m => m.componentName.startsWith(componentName));
    
    if (componentMetrics.length === 0) {
      return {
        averageRenderTime: 0,
        maxRenderTime: 0,
        totalRenders: 0,
        averageMemory: 0,
        averageFPS: 0
      };
    }

    const renderTimes = componentMetrics.map(m => m.renderTime);
    const memoryUsages = componentMetrics.filter(m => m.memoryUsage).map(m => m.memoryUsage!);
    const fpsValues = componentMetrics.filter(m => m.fps).map(m => m.fps!);

    return {
      averageRenderTime: renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length,
      maxRenderTime: Math.max(...renderTimes),
      totalRenders: componentMetrics.length,
      averageMemory: memoryUsages.length > 0 ? memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length : 0,
      averageFPS: fpsValues.length > 0 ? fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length : 0
    };
  }, [metrics, componentName]);

  // Track render time on every render
  useEffect(() => {
    if (!finalConfig.trackRenderTime) return;

    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    
    const metric: PerformanceMetrics = {
      componentName,
      renderTime,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      memoryUsage: finalConfig.trackMemory ? (performance as any).memory?.usedJSHeapSize : undefined
    };
    
    logMetric(metric);
    renderStartTime.current = performance.now();
  });

  // Start FPS monitoring on mount
  useEffect(() => {
    startFPSMonitoring();
    
    return () => {
      if (fpsInterval.current) {
        clearInterval(fpsInterval.current);
      }
    };
  }, [startFPSMonitoring]);

  // Monitor Core Web Vitals
  useEffect(() => {
    if (!finalConfig.trackNetwork || typeof window === 'undefined') return;

    // Monitor Largest Contentful Paint (LCP)
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log(`[Performance] LCP for ${componentName}: ${entry.startTime.toFixed(2)}ms`);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Browser might not support this metric
    }

    return () => observer.disconnect();
  }, [componentName, finalConfig.trackNetwork]);

  return { 
    measureAsync, 
    measureSync, 
    getAnalytics,
    metrics: metrics.filter(m => m.componentName.startsWith(componentName))
  };
};
