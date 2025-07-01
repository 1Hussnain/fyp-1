
-- First add a unique constraint on category names to prevent duplicates
ALTER TABLE public.categories ADD CONSTRAINT categories_name_unique UNIQUE (name);

-- First, let's ensure all tables have proper real-time configuration
-- Enable replica identity for real-time updates
ALTER TABLE public.transactions REPLICA IDENTITY FULL;
ALTER TABLE public.categories REPLICA IDENTITY FULL;
ALTER TABLE public.budgets REPLICA IDENTITY FULL;
ALTER TABLE public.financial_goals REPLICA IDENTITY FULL;

-- Add tables to realtime publication (skip if already exists)
DO $$
BEGIN
    -- Add budgets to realtime if not already added
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'budgets'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.budgets;
    END IF;

    -- Add financial_goals to realtime if not already added
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'financial_goals'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.financial_goals;
    END IF;
END $$;

-- Ensure proper RLS policies exist for all tables
-- Transactions policies
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can create their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete their own transactions" ON public.transactions;

CREATE POLICY "Users can view their own transactions" 
  ON public.transactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
  ON public.transactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
  ON public.transactions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" 
  ON public.transactions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable RLS on transactions if not already enabled
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Categories policies (allow read access to all users for system categories)
DROP POLICY IF EXISTS "Users can view categories" ON public.categories;
DROP POLICY IF EXISTS "Users can create their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON public.categories;

CREATE POLICY "Users can view categories" 
  ON public.categories 
  FOR SELECT 
  USING (is_system = true OR user_id = auth.uid());

CREATE POLICY "Users can create their own categories" 
  ON public.categories 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" 
  ON public.categories 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" 
  ON public.categories 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable RLS on categories if not already enabled
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Budgets policies
DROP POLICY IF EXISTS "Users can view their own budgets" ON public.budgets;
DROP POLICY IF EXISTS "Users can create their own budgets" ON public.budgets;
DROP POLICY IF EXISTS "Users can update their own budgets" ON public.budgets;
DROP POLICY IF EXISTS "Users can delete their own budgets" ON public.budgets;

CREATE POLICY "Users can view their own budgets" 
  ON public.budgets 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budgets" 
  ON public.budgets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets" 
  ON public.budgets 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets" 
  ON public.budgets 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable RLS on budgets if not already enabled
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Financial goals policies
DROP POLICY IF EXISTS "Users can view their own goals" ON public.financial_goals;
DROP POLICY IF EXISTS "Users can create their own goals" ON public.financial_goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON public.financial_goals;
DROP POLICY IF EXISTS "Users can delete their own goals" ON public.financial_goals;

CREATE POLICY "Users can view their own goals" 
  ON public.financial_goals 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goals" 
  ON public.financial_goals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" 
  ON public.financial_goals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" 
  ON public.financial_goals 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable RLS on financial_goals if not already enabled
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;

-- Clean up any problematic data that might cause conflicts
-- Remove any duplicate or orphaned records
DELETE FROM public.transactions WHERE user_id IS NULL;
DELETE FROM public.budgets WHERE user_id IS NULL;
DELETE FROM public.financial_goals WHERE user_id IS NULL;
DELETE FROM public.categories WHERE user_id IS NULL AND is_system IS NOT true;

-- Ensure we have some basic system categories
INSERT INTO public.categories (name, type, is_system, color, icon) VALUES
  ('Food & Dining', 'expense', true, '#FF6B6B', 'Utensils'),
  ('Transportation', 'expense', true, '#4ECDC4', 'Car'),
  ('Shopping', 'expense', true, '#45B7D1', 'ShoppingBag'),
  ('Entertainment', 'expense', true, '#96CEB4', 'Film'),
  ('Bills & Utilities', 'expense', true, '#FFEAA7', 'Zap'),
  ('Healthcare', 'expense', true, '#DDA0DD', 'Heart'),
  ('Education', 'expense', true, '#98D8C8', 'BookOpen'),
  ('Travel', 'expense', true, '#F7DC6F', 'Plane'),
  ('Salary', 'income', true, '#52C41A', 'DollarSign'),
  ('Freelance', 'income', true, '#1890FF', 'Briefcase'),
  ('Investment', 'income', true, '#722ED1', 'TrendingUp'),
  ('Other Income', 'income', true, '#13C2C2', 'Plus')
ON CONFLICT (name) DO NOTHING;
