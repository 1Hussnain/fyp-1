
/**
 * Skeleton Loading Component
 * 
 * Provides a skeleton loading placeholder with pulse animation.
 * Used to indicate loading states while content is being fetched.
 * Styled with Tailwind CSS for consistent theming.
 */

import { cn } from "@/lib/utils"

/**
 * Skeleton Component
 * 
 * Renders a gray animated placeholder that pulses to indicate loading.
 * Accepts all standard HTML div attributes for flexibility.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
