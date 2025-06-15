
/**
 * Supabase Services Export Module
 * 
 * This file serves as the main entry point for all Supabase-related services.
 * It exports various service modules and their associated types for:
 * - Transaction management
 * - Category management  
 * - Budget tracking
 * - Financial goals
 * - Document storage
 * - Chat functionality
 * - User preferences
 */

export { transactionService } from './transactions';
export { categoryService } from './categories';
export { budgetService } from './budgets';
export { goalService } from './goals';
export { documentService, folderService } from './documents';
export { chatService, type ChatHistory } from './chat';
export { preferencesService, type Preferences } from './preferences';
