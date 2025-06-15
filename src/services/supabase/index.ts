
/**
 * Supabase Services Export Module
 * 
 * This file serves as the main entry point for all Supabase-related services.
 * It exports various service modules and their associated types for:
 * - Transaction management with optimized queries
 * - Category management with caching support
 * - Budget tracking with real-time updates
 * - Financial goals with progress monitoring
 * - Document storage with metadata handling
 * - Chat functionality with conversation history
 * - User preferences with theme and notification settings
 * 
 * Performance optimizations:
 * - Tree-shakable exports for better bundle sizes
 * - Consistent error handling patterns
 * - Type-safe service interfaces
 * - Modular architecture for maintainability
 */

// Core service exports with full functionality
export { transactionService } from './transactions';
export { categoryService } from './categories';
export { budgetService } from './budgets';
export { goalService } from './goals';
export { documentService, folderService } from './documents';

// Chat service with type exports for comprehensive chat functionality
export { chatService } from './chat';
export type { ChatHistory } from './chat';

// Preferences service with type exports for user customization
export { preferencesService } from './preferences';
export type { Preferences } from './preferences';

// Re-export common types for convenience and consistency
export type { ServiceResponse } from '@/types/database';
