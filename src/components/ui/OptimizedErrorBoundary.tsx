
/**
 * Optimized Error Boundary Component
 * 
 * Enhanced error boundary with:
 * - Automatic error recovery mechanisms
 * - Performance impact monitoring
 * - Graceful fallback UI states
 * - Error reporting and analytics
 * - Memory leak prevention
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  /** Child components to wrap */
  children: ReactNode;
  /** Custom fallback component */
  fallback?: ReactNode;
  /** Component identifier for error tracking */
  componentId?: string;
  /** Enable automatic retry after errors */
  enableAutoRetry?: boolean;
  /** Auto retry delay in milliseconds */
  autoRetryDelay?: number;
  /** Maximum auto retry attempts */
  maxAutoRetries?: number;
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error that occurred */
  error: Error | null;
  /** Additional error information */
  errorInfo: ErrorInfo | null;
  /** Current retry attempt count */
  retryCount: number;
  /** Whether currently attempting auto-retry */
  isAutoRetrying: boolean;
}

/**
 * OptimizedErrorBoundary Class Component
 * 
 * Catches JavaScript errors in child components and displays fallback UI.
 * Includes advanced features like auto-retry, performance monitoring, and
 * comprehensive error reporting for better fault tolerance.
 */
class OptimizedErrorBoundary extends Component<Props, State> {
  private autoRetryTimeout: NodeJS.Timeout | null = null;
  private performanceObserver: PerformanceObserver | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isAutoRetrying: false
    };
  }

  /**
   * Static method to update state when an error is caught
   */
  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  /**
   * Lifecycle method called when an error is caught
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { componentId, onError, enableAutoRetry, maxAutoRetries = 2 } = this.props;
    
    // Log error details for debugging
    console.error(`[ErrorBoundary${componentId ? ` - ${componentId}` : ''}] Error caught:`, {
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // Update state with error information
    this.setState({
      errorInfo,
      retryCount: this.state.retryCount + 1
    });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // Attempt auto-retry if enabled and within limits
    if (enableAutoRetry && this.state.retryCount < maxAutoRetries) {
      this.performAutoRetry();
    }

    // Monitor performance impact of error boundary
    this.monitorPerformanceImpact();
  }

  /**
   * Setup performance monitoring for error boundary impact
   */
  private monitorPerformanceImpact = () => {
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 100) { // Log slow operations
            console.warn(`[ErrorBoundary] Performance impact detected: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
          }
        });
      });

      this.performanceObserver.observe({ entryTypes: ['measure', 'navigation'] });
    }
  };

  /**
   * Perform automatic retry with exponential backoff
   */
  private performAutoRetry = () => {
    const { autoRetryDelay = 2000 } = this.props;
    const backoffDelay = autoRetryDelay * Math.pow(2, this.state.retryCount - 1);

    this.setState({ isAutoRetrying: true });

    this.autoRetryTimeout = setTimeout(() => {
      this.handleRetry();
      this.setState({ isAutoRetrying: false });
    }, backoffDelay);
  };

  /**
   * Handle manual retry attempts
   */
  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isAutoRetrying: false
    });
  };

  /**
   * Handle navigation back to home page
   */
  private handleGoHome = () => {
    window.location.href = '/';
  };

  /**
   * Cleanup on component unmount
   */
  componentWillUnmount() {
    if (this.autoRetryTimeout) {
      clearTimeout(this.autoRetryTimeout);
    }
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
  }

  /**
   * Render fallback UI when error occurs
   */
  private renderFallbackUI = () => {
    const { fallback, componentId } = this.props;
    const { error, isAutoRetrying, retryCount } = this.state;

    // Use custom fallback if provided
    if (fallback) {
      return fallback;
    }

    // Default error UI with retry and navigation options
    return (
      <Card className="max-w-md mx-auto mt-8 border-destructive">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-destructive">
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            {componentId ? `Error in ${componentId} component` : 'An unexpected error occurred'}
            {retryCount > 1 && ` (Attempt ${retryCount})`}
          </p>
          
          {error && (
            <details className="text-xs bg-muted p-2 rounded">
              <summary className="cursor-pointer">Error Details</summary>
              <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
            </details>
          )}

          <div className="flex flex-col gap-2">
            <Button 
              onClick={this.handleRetry}
              disabled={isAutoRetrying}
              className="w-full"
            >
              {isAutoRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={this.handleGoHome}
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  render() {
    if (this.state.hasError) {
      return this.renderFallbackUI();
    }

    return this.props.children;
  }
}

export default OptimizedErrorBoundary;
