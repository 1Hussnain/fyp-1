
import React, { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptimizedLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  overlay?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8'
};

const OptimizedLoadingSpinner = memo(({ 
  size = 'md', 
  className, 
  text,
  overlay = false 
}: OptimizedLoadingSpinnerProps) => {
  const content = (
    <div className={cn(
      "flex items-center justify-center",
      overlay && "absolute inset-0 bg-white/80 backdrop-blur-sm z-50",
      className
    )}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className={cn("animate-spin text-blue-600", sizeClasses[size])} />
        {text && (
          <p className="text-sm text-gray-600 animate-pulse">{text}</p>
        )}
      </div>
    </div>
  );

  return content;
});

OptimizedLoadingSpinner.displayName = "OptimizedLoadingSpinner";

export default OptimizedLoadingSpinner;
