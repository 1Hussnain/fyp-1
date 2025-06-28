
import React, { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FastLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  inline?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6', 
  lg: 'h-8 w-8'
};

const FastLoadingSpinner = memo(({ 
  size = 'md', 
  className,
  text,
  inline = false
}: FastLoadingSpinnerProps) => {
  if (inline) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Loader2 className={cn("animate-spin text-blue-600", sizeClasses[size])} />
        {text && <span className="text-sm text-gray-600">{text}</span>}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className={cn("animate-spin text-blue-600", sizeClasses[size])} />
        {text && (
          <p className="text-sm text-gray-600 animate-pulse">{text}</p>
        )}
      </div>
    </div>
  );
});

FastLoadingSpinner.displayName = "FastLoadingSpinner";

export default FastLoadingSpinner;
