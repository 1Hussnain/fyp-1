
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  componentName?: string;
  showRetry?: boolean;
  minimal?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ComponentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error in ${this.props.componentName || 'component'}:`, error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.minimal) {
        return (
          <div className="p-4 text-center text-gray-500">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm">Failed to load {this.props.componentName || 'component'}</p>
            {this.props.showRetry && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={this.handleRetry}
                className="mt-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
        );
      }

      return (
        <Alert variant="destructive" className="m-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Component Error</AlertTitle>
          <AlertDescription>
            {this.props.componentName && (
              <div className="mb-2">
                Failed to render {this.props.componentName}
              </div>
            )}
            <div className="text-xs opacity-75">
              {this.state.error?.message || 'An unexpected error occurred'}
            </div>
            {this.props.showRetry && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={this.handleRetry}
                className="mt-3"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Try Again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ComponentErrorBoundary;
