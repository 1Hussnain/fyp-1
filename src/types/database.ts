
import { Database } from '@/integrations/supabase/types';

// Database table types
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];

export type Category = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];

export type Budget = Database['public']['Tables']['budgets']['Row'];
export type BudgetInsert = Database['public']['Tables']['budgets']['Insert'];
export type BudgetUpdate = Database['public']['Tables']['budgets']['Update'];

export type FinancialGoal = Database['public']['Tables']['financial_goals']['Row'];
export type FinancialGoalInsert = Database['public']['Tables']['financial_goals']['Insert'];
export type FinancialGoalUpdate = Database['public']['Tables']['financial_goals']['Update'];

export type Document = Database['public']['Tables']['documents']['Row'];
export type DocumentInsert = Database['public']['Tables']['documents']['Insert'];

export type Folder = Database['public']['Tables']['folders']['Row'];
export type FolderInsert = Database['public']['Tables']['folders']['Insert'];

// New admin-related types
export type UserRole = Database['public']['Tables']['user_roles']['Row'];
export type UserRoleInsert = Database['public']['Tables']['user_roles']['Insert'];

export type AdminActivity = Database['public']['Tables']['admin_activities']['Row'];
export type AdminActivityInsert = Database['public']['Tables']['admin_activities']['Insert'];

export type UserAnalytics = Database['public']['Views']['user_analytics']['Row'];

// Extended types with relationships
export type TransactionWithCategory = Transaction & {
  categories?: Category | null;
};

export type CategorySpending = {
  name: string;
  amount: number;
  fill: string;
  percentage: number;
};

export type FinancialSummary = {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  transactionCount: number;
};

export type ServiceResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Admin specific types
export type AppRole = 'admin' | 'moderator' | 'user';

export type UserWithRoles = Database['public']['Tables']['profiles']['Row'] & {
  user_roles?: UserRole[];
};
