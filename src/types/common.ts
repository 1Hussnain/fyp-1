
/**
 * Common Type Definitions Module
 * 
 * Contains shared type definitions used across the application:
 * - API response types with proper error handling
 * - Common UI state types for consistency
 * - Utility types for better type safety
 * - Performance-related types for monitoring
 */

/** Standard API response wrapper for consistent error handling */
export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  success: boolean;
  timestamp?: string;
}

/** Loading states for better UX consistency */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/** Common pagination interface for scalable data handling */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Performance monitoring types */
export interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  memoryUsage?: number;
  timestamp: number;
}

/** Error boundary error info type */
export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
}

/** Generic form field type for consistent form handling */
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
  required?: boolean;
}

/** Utility type for making specific properties required */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** Utility type for optional ID fields in create operations */
export type CreateInput<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;

/** Cache configuration for performance optimization */
export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number;
  strategy: 'lru' | 'fifo';
}
