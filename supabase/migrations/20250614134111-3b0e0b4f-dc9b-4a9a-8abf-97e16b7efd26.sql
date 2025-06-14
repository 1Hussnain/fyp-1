
-- Drop existing tables to start fresh (be careful with real data!)
DROP TABLE IF EXISTS public.financial_goals CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.budgets CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;

-- Create optimized categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  color TEXT DEFAULT '#3B82F6',
  icon TEXT DEFAULT 'DollarSign',
  is_system BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Ensure unique category names per user per type
  UNIQUE(name, type, user_id)
);

-- Create optimized transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create optimized budgets table
CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  monthly_limit DECIMAL(12,2) NOT NULL CHECK (monthly_limit > 0),
  current_spent DECIMAL(12,2) DEFAULT 0 CHECK (current_spent >= 0),
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL CHECK (year > 2000),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Ensure one budget per category per month per user
  UNIQUE(user_id, category_id, month, year)
);

-- Create optimized financial goals table
CREATE TABLE public.financial_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(12,2) NOT NULL CHECK (target_amount > 0),
  saved_amount DECIMAL(12,2) DEFAULT 0 CHECK (saved_amount >= 0),
  goal_type TEXT NOT NULL CHECK (goal_type IN ('emergency', 'vacation', 'investment', 'purchase', 'debt', 'other')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  deadline DATE NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create performance indexes
CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, date DESC);
CREATE INDEX idx_transactions_user_type ON public.transactions(user_id, type);
CREATE INDEX idx_transactions_category ON public.transactions(category_id);
CREATE INDEX idx_budgets_user_period ON public.budgets(user_id, year, month);
CREATE INDEX idx_goals_user_deadline ON public.financial_goals(user_id, deadline);
CREATE INDEX idx_goals_user_completed ON public.financial_goals(user_id, is_completed);
CREATE INDEX idx_categories_user_type ON public.categories(user_id, type);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categories
CREATE POLICY "Users can manage their own categories" ON public.categories
  FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- Create RLS policies for transactions
CREATE POLICY "Users can manage their own transactions" ON public.transactions
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for budgets
CREATE POLICY "Users can manage their own budgets" ON public.budgets
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for financial goals
CREATE POLICY "Users can manage their own goals" ON public.financial_goals
  FOR ALL USING (auth.uid() = user_id);

-- Insert default system categories
INSERT INTO public.categories (name, type, color, icon, is_system, user_id) VALUES
  ('Salary', 'income', '#10B981', 'Briefcase', true, NULL),
  ('Freelance', 'income', '#059669', 'Laptop', true, NULL),
  ('Investment', 'income', '#0D9488', 'TrendingUp', true, NULL),
  ('Food & Dining', 'expense', '#EF4444', 'Utensils', true, NULL),
  ('Transportation', 'expense', '#F97316', 'Car', true, NULL),
  ('Shopping', 'expense', '#8B5CF6', 'ShoppingBag', true, NULL),
  ('Entertainment', 'expense', '#EC4899', 'Music', true, NULL),
  ('Bills & Utilities', 'expense', '#6B7280', 'FileText', true, NULL),
  ('Healthcare', 'expense', '#DC2626', 'Heart', true, NULL),
  ('Education', 'expense', '#7C3AED', 'GraduationCap', true, NULL);

-- Create materialized views for better performance
CREATE MATERIALIZED VIEW public.user_financial_summary AS
SELECT 
  t.user_id,
  DATE_TRUNC('month', t.date) as month,
  SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as total_income,
  SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as total_expenses,
  COUNT(*) as transaction_count
FROM public.transactions t
GROUP BY t.user_id, DATE_TRUNC('month', t.date);

-- Create index on materialized view
CREATE UNIQUE INDEX idx_user_financial_summary ON public.user_financial_summary(user_id, month);

-- Create function to refresh summary
CREATE OR REPLACE FUNCTION refresh_user_financial_summary()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.user_financial_summary;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-refresh summary
CREATE TRIGGER trigger_refresh_financial_summary
  AFTER INSERT OR UPDATE OR DELETE ON public.transactions
  FOR EACH STATEMENT
  EXECUTE FUNCTION refresh_user_financial_summary();
