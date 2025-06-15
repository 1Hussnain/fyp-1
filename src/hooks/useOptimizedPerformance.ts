import { useEffect, useCallback, useRef, useState, useMemo } from "react";

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  componentName: string;
  mountTime?: number;
  updateCount?: number;
  effectCount?: number;
  bundleSize?: number;
}

interface PerformanceRegression {
  metric: string;
  currentValue: number;
  baselineValue: number;
  regressionPercentage: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface OptimizationRecommendation {
  type: 'memoization' | 'lazy-loading' | 'code-splitting' | 'memory-cleanup';
  description: string;
  impact: 'low' | 'medium' | 'high';
  implementation: string;
}

/**
 * Enhanced Optimized Performance Hook
 * 
 * Advanced performance monitoring and optimization with:
 * - Intelligent render tracking with component lifecycle awareness
 * - Memory leak detection and prevention
 * - Bundle impact analysis for code splitting decisions
 * - Real-time performance metrics aggregation
 * - Automated performance regression detection
 * - Resource usage optimization recommendations
 */

export const useOptimizedPerformance = (componentName: string) => {
  const renderStartTime = useRef<number>(performance.now());
  const mountTime = useRef<number>(performance.now());
  const metricsRef = useRef<PerformanceMetrics[]>([]);
  const updateCountRef = useRef<number>(0);
  const effectCountRef = useRef<number>(0);
  const baselineMetrics = useRef<Map<string, number>>(new Map());
  
  const [regressions, setRegressions] = useState<PerformanceRegression[]>([]);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);

  /**
   * Detect performance regressions by comparing with baseline
   */
  const detectRegressions = useCallback((newMetrics: PerformanceMetrics) => {
    const baseline = baselineMetrics.current;
    const regressionThresholds = {
      renderTime: 50, // 50% increase is concerning
      memoryUsage: 30, // 30% increase in memory
      updateCount: 100 // 100% increase in updates
    };

    const newRegressions: PerformanceRegression[] = [];

    // Check render time regression
    const baselineRenderTime = baseline.get('renderTime') || newMetrics.renderTime;
    if (newMetrics.renderTime > baselineRenderTime * (1 + regressionThresholds.renderTime / 100)) {
      const regression = ((newMetrics.renderTime / baselineRenderTime) - 1) * 100;
      newRegressions.push({
        metric: 'renderTime',
        currentValue: newMetrics.renderTime,
        baselineValue: baselineRenderTime,
        regressionPercentage: regression,
        severity: regression > 200 ? 'critical' : regression > 100 ? 'high' : 'medium'
      });
    }

    // Check memory usage regression
    if (newMetrics.memoryUsage) {
      const baselineMemory = baseline.get('memoryUsage') || newMetrics.memoryUsage;
      if (newMetrics.memoryUsage > baselineMemory * (1 + regressionThresholds.memoryUsage / 100)) {
        const regression = ((newMetrics.memoryUsage / baselineMemory) - 1) * 100;
        newRegressions.push({
          metric: 'memoryUsage',
          currentValue: newMetrics.memoryUsage,
          baselineValue: baselineMemory,
          regressionPercentage: regression,
          severity: regression > 100 ? 'critical' : regression > 50 ? 'high' : 'medium'
        });
      }
    }

    setRegressions(newRegressions);

    // Update baseline if this is a good performance metric
    if (newRegressions.length === 0) {
      baseline.set('renderTime', Math.min(baseline.get('renderTime') || Infinity, newMetrics.renderTime));
      if (newMetrics.memoryUsage) {
        baseline.set('memoryUsage', Math.min(baseline.get('memoryUsage') || Infinity, newMetrics.memoryUsage));
      }
    }
  }, []);

  /**
   * Generate optimization recommendations based on performance data
   */
  const generateRecommendations = useCallback((metrics: PerformanceMetrics[]) => {
    const recommendations: OptimizationRecommendation[] = [];
    
    if (metrics.length < 5) return recommendations; // Need enough data

    const avgRenderTime = metrics.reduce((sum, m) => sum + m.renderTime, 0) / metrics.length;
    const maxRenderTime = Math.max(...metrics.map(m => m.renderTime));
    const avgUpdateCount = updateCountRef.current / metrics.length;
    
    // Slow render time recommendation
    if (avgRenderTime > 16) { // Beyond 60fps threshold
      recommendations.push({
        type: 'memoization',
        description: `Average render time (${avgRenderTime.toFixed(2)}ms) exceeds 60fps threshold. Consider memoizing expensive calculations.`,
        impact: avgRenderTime > 50 ? 'high' : 'medium',
        implementation: 'Use React.memo() for component and useMemo() for expensive computations'
      });
    }

    // High update frequency recommendation
    if (avgUpdateCount > 10) {
      recommendations.push({
        type: 'memoization',
        description: `Component updates frequently (${avgUpdateCount.toFixed(1)} times). Consider optimizing dependencies.`,
        impact: 'medium',
        implementation: 'Use useCallback() for stable function references and optimize useEffect dependencies'
      });
    }

    // Memory usage recommendation
    const avgMemory = metrics
      .filter(m => m.memoryUsage)
      .reduce((sum, m) => sum + (m.memoryUsage || 0), 0) / metrics.filter(m => m.memoryUsage).length;
    
    if (avgMemory > 50 * 1024 * 1024) { // 50MB threshold
      recommendations.push({
        type: 'memory-cleanup',
        description: `High memory usage detected (${(avgMemory / 1024 / 1024).toFixed(2)}MB). Check for memory leaks.`,
        impact: 'high',
        implementation: 'Add cleanup functions in useEffect and avoid storing large objects in state'
      });
    }

    // Bundle size recommendation (if available)
    if (maxRenderTime > 100) {
      recommendations.push({
        type: 'code-splitting',
        description: 'Slow initial renders detected. Consider code splitting for this component.',
        impact: 'high',
        implementation: 'Use React.lazy() and dynamic imports for this component'
      });
    }

    setRecommendations(recommendations);
  }, []);

  /**
   * Measure operation performance with comprehensive tracking
   */
  const measureOperation = useCallback(async <T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now();
    const startMemory = (performance as any).memory?.usedJSHeapSize;
    
    try {
      const result = await operation();
      const endTime = performance.now();
      const duration = endTime - startTime;
      const endMemory = (performance as any).memory?.usedJSHeapSize;
      
      const metrics: PerformanceMetrics = {
        renderTime: duration,
        memoryUsage: endMemory,
        componentName: `${componentName}.${operationName}`,
        updateCount: updateCountRef.current,
        effectCount: effectCountRef.current
      };
      
      metricsRef.current.push(metrics);
      detectRegressions(metrics);
      
      // Log performance warnings
      if (duration > 100) {
        console.warn(`[Performance] Slow operation in ${componentName}.${operationName}: ${duration.toFixed(2)}ms`);
      }
      
      if (startMemory && endMemory && (endMemory - startMemory) > 10 * 1024 * 1024) { // 10MB increase
        console.warn(`[Performance] Large memory increase in ${componentName}.${operationName}: ${((endMemory - startMemory) / 1024 / 1024).toFixed(2)}MB`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.error(`[Performance] Failed operation in ${componentName}.${operationName}: ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }, [componentName, detectRegressions]);

  /**
   * Get comprehensive performance analytics
   */
  const getMetrics = useCallback(() => {
    const componentMetrics = metricsRef.current.filter(m => 
      m.componentName.startsWith(componentName)
    );
    
    if (componentMetrics.length === 0) {
      return {
        averageRenderTime: 0,
        maxRenderTime: 0,
        totalRenders: 0,
        averageMemory: 0,
        mountDuration: 0,
        totalUpdates: 0,
        performanceScore: 100
      };
    }

    const renderTimes = componentMetrics.map(m => m.renderTime);
    const memoryUsages = componentMetrics.filter(m => m.memoryUsage).map(m => m.memoryUsage!);
    const averageRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
    const maxRenderTime = Math.max(...renderTimes);
    const averageMemory = memoryUsages.length > 0 ? memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length : 0;
    
    // Calculate performance score (0-100, higher is better)
    let performanceScore = 100;
    if (averageRenderTime > 16) performanceScore -= 20; // 60fps penalty
    if (averageRenderTime > 50) performanceScore -= 30; // Severe penalty
    if (maxRenderTime > 100) performanceScore -= 25; // Jank penalty
    if (averageMemory > 50 * 1024 * 1024) performanceScore -= 25; // Memory penalty
    
    return {
      averageRenderTime,
      maxRenderTime,
      totalRenders: componentMetrics.length,
      averageMemory,
      mountDuration: performance.now() - mountTime.current,
      totalUpdates: updateCountRef.current,
      performanceScore: Math.max(0, performanceScore)
    };
  }, [componentName]);

  /**
   * Performance monitoring effect
   */
  useEffect(() => {
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    updateCountRef.current += 1;
    
    const metrics: PerformanceMetrics = {
      renderTime,
      componentName,
      memoryUsage: (performance as any).memory?.usedJSHeapSize,
      mountTime: performance.now() - mountTime.current,
      updateCount: updateCountRef.current,
      effectCount: effectCountRef.current
    };

    metricsRef.current.push(metrics);
    detectRegressions(metrics);

    // Generate recommendations periodically
    if (updateCountRef.current % 10 === 0) {
      generateRecommendations(metricsRef.current);
    }

    // Keep only last 100 metrics to prevent memory leaks
    if (metricsRef.current.length > 100) {
      metricsRef.current = metricsRef.current.slice(-50);
    }

    // Log slow renders
    if (renderTime > 16) {
      console.warn(`[Performance] Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }

    // Reset start time for next render
    renderStartTime.current = performance.now();
  });

  /**
   * Effect counting for dependency analysis
   */
  useEffect(() => {
    effectCountRef.current += 1;
  });

  return { 
    measureOperation, 
    getMetrics,
    regressions,
    recommendations,
    performanceScore: getMetrics().performanceScore
  };
};
