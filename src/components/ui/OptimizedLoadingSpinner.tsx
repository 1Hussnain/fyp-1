
/**
 * Optimized Loading Spinner Component
 * 
 * A memoized loading spinner component with customizable:
 * - Size variants (small, medium, large)
 * - Optional text display
 * - Overlay mode for full-screen loading
 * - Tailwind CSS styling with animations
 */

import React, { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props interface for OptimizedLoadingSpinner
 */
interface OptimizedLoadingSpinnerProps {
  /** Size variant for the spinner */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
  /** Optional text to display below spinner */
  text?: string;
  /** Whether to display as full-screen overlay */
  overlay?: boolean;
}

/**
 * Predefined size classes for different spinner sizes
 */
const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8'
};

/**
 * OptimizedLoadingSpinner Component
 * 
 * Displays an animated loading spinner with optional text and overlay modes.
 * Uses React.memo for performance optimization to prevent unnecessary re-renders.
 */
const OptimizedLoadingSpinner = memo(({ 
  size = 'md', 
  className, 
  text,
  overlay = false 
}: OptimizedLoadingSpinnerProps) => {
  const content = (
    <div className={cn(
      "flex items-center justify-center",
      // Apply overlay styles if overlay mode is enabled
      overlay && "absolute inset-0 bg-white/80 backdrop-blur-sm z-50",
      className
    )}>
      <div className="flex flex-col items-center gap-2">
        {/* Rotating loader icon with blue color and size variant */}
        <Loader2 className={cn("animate-spin text-blue-600", sizeClasses[size])} />
        {/* Optional text with pulse animation */}
        {text && (
          <p className="text-sm text-gray-600 animate-pulse">{text}</p>
        )}
      </div>
    </div>
  );

  return content;
});

// Set display name for debugging purposes
OptimizedLoadingSpinner.displayName = "OptimizedLoadingSpinner";

export default OptimizedLoadingSpinner;
