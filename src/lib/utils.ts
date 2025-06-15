
/**
 * Utility Functions Module
 * 
 * Contains common utility functions used throughout the application:
 * - cn: Combines and merges CSS class names using clsx and tailwind-merge
 * 
 * The cn function is particularly useful for conditional styling and
 * ensuring Tailwind CSS classes are properly merged without conflicts.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names and merges Tailwind CSS classes intelligently
 * @param inputs - Variable number of class values to combine
 * @returns Merged and deduplicated class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
