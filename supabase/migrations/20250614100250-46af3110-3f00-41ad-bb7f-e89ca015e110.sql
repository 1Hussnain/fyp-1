
-- First, let's add the unique constraint for categories
ALTER TABLE public.categories 
ADD CONSTRAINT unique_category_name_type UNIQUE (name, type);

-- Enable RLS on all tables (some may already be enabled)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preferences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them consistently
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can create their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete their own transactions" ON public.transactions;

-- Transaction policies
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

-- Budget policies
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

-- Financial goals policies
DROP POLICY IF EXISTS "Users can view their own financial goals" ON public.financial_goals;
DROP POLICY IF EXISTS "Users can create their own financial goals" ON public.financial_goals;
DROP POLICY IF EXISTS "Users can update their own financial goals" ON public.financial_goals;
DROP POLICY IF EXISTS "Users can delete their own financial goals" ON public.financial_goals;

CREATE POLICY "Users can view their own financial goals" 
  ON public.financial_goals 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own financial goals" 
  ON public.financial_goals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own financial goals" 
  ON public.financial_goals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own financial goals" 
  ON public.financial_goals 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Categories policies (allow users to see system categories and their own)
DROP POLICY IF EXISTS "Users can view categories" ON public.categories;
DROP POLICY IF EXISTS "Users can create their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON public.categories;

CREATE POLICY "Users can view categories" 
  ON public.categories 
  FOR SELECT 
  USING (is_system = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own categories" 
  ON public.categories 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id AND is_system = false);

CREATE POLICY "Users can update their own categories" 
  ON public.categories 
  FOR UPDATE 
  USING (auth.uid() = user_id AND is_system = false);

CREATE POLICY "Users can delete their own categories" 
  ON public.categories 
  FOR DELETE 
  USING (auth.uid() = user_id AND is_system = false);

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Preferences policies
DROP POLICY IF EXISTS "Users can view their own preferences" ON public.preferences;
DROP POLICY IF EXISTS "Users can create their own preferences" ON public.preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON public.preferences;

CREATE POLICY "Users can view their own preferences" 
  ON public.preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" 
  ON public.preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
  ON public.preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add data validation constraints (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'transactions_amount_positive') THEN
        ALTER TABLE public.transactions ADD CONSTRAINT transactions_amount_positive CHECK (amount > 0);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'transactions_type_valid') THEN
        ALTER TABLE public.transactions ADD CONSTRAINT transactions_type_valid CHECK (type IN ('income', 'expense'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'budgets_monthly_limit_positive') THEN
        ALTER TABLE public.budgets ADD CONSTRAINT budgets_monthly_limit_positive CHECK (monthly_limit > 0);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'budgets_current_spent_non_negative') THEN
        ALTER TABLE public.budgets ADD CONSTRAINT budgets_current_spent_non_negative CHECK (current_spent >= 0);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'budgets_month_valid') THEN
        ALTER TABLE public.budgets ADD CONSTRAINT budgets_month_valid CHECK (month BETWEEN 1 AND 12);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'budgets_year_valid') THEN
        ALTER TABLE public.budgets ADD CONSTRAINT budgets_year_valid CHECK (year BETWEEN 2000 AND 2100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'goals_target_amount_positive') THEN
        ALTER TABLE public.financial_goals ADD CONSTRAINT goals_target_amount_positive CHECK (target_amount > 0);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'goals_saved_amount_non_negative') THEN
        ALTER TABLE public.financial_goals ADD CONSTRAINT goals_saved_amount_non_negative CHECK (saved_amount >= 0);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'goals_deadline_future') THEN
        ALTER TABLE public.financial_goals ADD CONSTRAINT goals_deadline_future CHECK (deadline >= CURRENT_DATE);
    END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_type ON public.transactions(user_id, type);
CREATE INDEX IF NOT EXISTS idx_transactions_user_category ON public.transactions(user_id, category);
CREATE INDEX IF NOT EXISTS idx_budgets_user_period ON public.budgets(user_id, year, month);
CREATE INDEX IF NOT EXISTS idx_financial_goals_user ON public.financial_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_type ON public.categories(type, is_system);

-- Ensure unique budget entries per user per month/year
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_user_budget_month_year'
    ) THEN
        ALTER TABLE public.budgets 
        ADD CONSTRAINT unique_user_budget_month_year 
        UNIQUE (user_id, month, year);
    END IF;
END $$;

-- Insert some default system categories (now with proper unique constraint)
INSERT INTO public.categories (name, type, is_system, color) 
VALUES 
  ('Food & Dining', 'expense', true, '#FF6B6B'),
  ('Transportation', 'expense', true, '#4ECDC4'),
  ('Shopping', 'expense', true, '#45B7D1'),
  ('Entertainment', 'expense', true, '#FFA07A'),
  ('Bills & Utilities', 'expense', true, '#98D8C8'),
  ('Healthcare', 'expense', true, '#F7DC6F'),
  ('Education', 'expense', true, '#BB8FCE'),
  ('Salary', 'income', true, '#52C41A'),
  ('Freelance', 'income', true, '#1890FF'),
  ('Investment', 'income', true, '#722ED1'),
  ('Other Income', 'income', true, '#13C2C2')
ON CONFLICT (name, type) DO NOTHING;
