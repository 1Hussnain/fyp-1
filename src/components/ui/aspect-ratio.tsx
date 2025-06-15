
/**
 * Aspect Ratio Component
 * 
 * A wrapper around Radix UI's AspectRatio primitive.
 * Provides consistent aspect ratio containers for responsive layouts.
 * Useful for images, videos, and other media content that needs
 * to maintain specific width-to-height ratios.
 */

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

// Re-export the Radix UI AspectRatio as our custom component
const AspectRatio = AspectRatioPrimitive.Root

export { AspectRatio }
