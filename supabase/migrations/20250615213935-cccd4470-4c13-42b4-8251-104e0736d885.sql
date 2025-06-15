
-- Create app role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(user_id, 'admin'::app_role)
$$;

-- Create admin_activities table for audit logging
CREATE TABLE public.admin_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) NOT NULL,
    action_type TEXT NOT NULL,
    target_type TEXT,
    target_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on admin_activities
ALTER TABLE public.admin_activities ENABLE ROW LEVEL SECURITY;

-- Create user analytics materialized view
CREATE MATERIALIZED VIEW public.user_analytics AS
SELECT 
    p.id,
    p.email,
    p.first_name,
    p.last_name,
    p.created_at as user_created_at,
    COUNT(DISTINCT t.id) as total_transactions,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as total_income,
    COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as total_expenses,
    COUNT(DISTINCT fg.id) as total_goals,
    COUNT(DISTINCT CASE WHEN fg.is_completed = true THEN fg.id END) as completed_goals,
    MAX(t.created_at) as last_transaction_date
FROM public.profiles p
LEFT JOIN public.transactions t ON p.id = t.user_id
LEFT JOIN public.financial_goals fg ON p.id = fg.user_id
GROUP BY p.id, p.email, p.first_name, p.last_name, p.created_at;

-- Create index for better performance
CREATE INDEX idx_user_analytics_email ON public.user_analytics(email);
CREATE INDEX idx_user_analytics_created_at ON public.user_analytics(user_created_at);

-- RLS Policies for user_roles table
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can manage roles" 
ON public.user_roles 
FOR ALL 
USING (public.is_admin());

-- RLS Policies for admin_activities table
CREATE POLICY "Admins can view all activities" 
ON public.admin_activities 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can log activities" 
ON public.admin_activities 
FOR INSERT 
WITH CHECK (public.is_admin() AND admin_id = auth.uid());

-- Update existing table RLS policies to allow admin access
-- Transactions table
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions or admins can view all" 
ON public.transactions 
FOR SELECT 
USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
CREATE POLICY "Users can insert own transactions or admins can manage all" 
ON public.transactions 
FOR INSERT 
WITH CHECK (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
CREATE POLICY "Users can update own transactions or admins can manage all" 
ON public.transactions 
FOR UPDATE 
USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transactions;
CREATE POLICY "Users can delete own transactions or admins can manage all" 
ON public.transactions 
FOR DELETE 
USING (user_id = auth.uid() OR public.is_admin());

-- Financial goals table
DROP POLICY IF EXISTS "Users can view own goals" ON public.financial_goals;
CREATE POLICY "Users can view own goals or admins can view all" 
ON public.financial_goals 
FOR SELECT 
USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own goals" ON public.financial_goals;
CREATE POLICY "Users can insert own goals or admins can manage all" 
ON public.financial_goals 
FOR INSERT 
WITH CHECK (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own goals" ON public.financial_goals;
CREATE POLICY "Users can update own goals or admins can manage all" 
ON public.financial_goals 
FOR UPDATE 
USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can delete own goals" ON public.financial_goals;
CREATE POLICY "Users can delete own goals or admins can manage all" 
ON public.financial_goals 
FOR DELETE 
USING (user_id = auth.uid() OR public.is_admin());

-- Categories table
DROP POLICY IF EXISTS "Users can view their categories and system categories" ON public.categories;
CREATE POLICY "Users can view their categories and system categories or admins can view all" 
ON public.categories 
FOR SELECT 
USING (user_id = auth.uid() OR is_system = true OR public.is_admin());

DROP POLICY IF EXISTS "Users can create their own categories" ON public.categories;
CREATE POLICY "Users can create their own categories or admins can manage all" 
ON public.categories 
FOR INSERT 
WITH CHECK (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can update their own categories" ON public.categories;
CREATE POLICY "Users can update their own categories or admins can manage all" 
ON public.categories 
FOR UPDATE 
USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can delete their own categories" ON public.categories;
CREATE POLICY "Users can delete their own categories or admins can manage all" 
ON public.categories 
FOR DELETE 
USING (user_id = auth.uid() OR public.is_admin());

-- Budgets table
DROP POLICY IF EXISTS "Users can view own budgets" ON public.budgets;
CREATE POLICY "Users can view own budgets or admins can view all" 
ON public.budgets 
FOR SELECT 
USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own budgets" ON public.budgets;
CREATE POLICY "Users can insert own budgets or admins can manage all" 
ON public.budgets 
FOR INSERT 
WITH CHECK (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own budgets" ON public.budgets;
CREATE POLICY "Users can update own budgets or admins can manage all" 
ON public.budgets 
FOR UPDATE 
USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can delete own budgets" ON public.budgets;
CREATE POLICY "Users can delete own budgets or admins can manage all" 
ON public.budgets 
FOR DELETE 
USING (user_id = auth.uid() OR public.is_admin());

-- Profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile or admins can view all" 
ON public.profiles 
FOR SELECT 
USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile or admins can manage all" 
ON public.profiles 
FOR UPDATE 
USING (id = auth.uid() OR public.is_admin());

-- Documents table
DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
CREATE POLICY "Users can view their own documents or admins can view all" 
ON public.documents 
FOR SELECT 
USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert their own documents" ON public.documents;
CREATE POLICY "Users can insert their own documents or admins can manage all" 
ON public.documents 
FOR INSERT 
WITH CHECK (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can update their own documents" ON public.documents;
CREATE POLICY "Users can update their own documents or admins can manage all" 
ON public.documents 
FOR UPDATE 
USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;
CREATE POLICY "Users can delete their own documents or admins can manage all" 
ON public.documents 
FOR DELETE 
USING (user_id = auth.uid() OR public.is_admin());

-- Chat history table
DROP POLICY IF EXISTS "Users can view own chat history" ON public.chat_history;
CREATE POLICY "Users can view own chat history or admins can view all" 
ON public.chat_history 
FOR SELECT 
USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own chat history" ON public.chat_history;
CREATE POLICY "Users can insert own chat history or admins can manage all" 
ON public.chat_history 
FOR INSERT 
WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- Preferences table
DROP POLICY IF EXISTS "Users can view own preferences" ON public.preferences;
CREATE POLICY "Users can view own preferences or admins can view all" 
ON public.preferences 
FOR SELECT 
USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own preferences" ON public.preferences;
CREATE POLICY "Users can update own preferences or admins can manage all" 
ON public.preferences 
FOR UPDATE 
USING (user_id = auth.uid() OR public.is_admin());

-- Function to refresh user analytics materialized view
CREATE OR REPLACE FUNCTION public.refresh_user_analytics()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.user_analytics;
END;
$$;

-- Function to log admin activities
CREATE OR REPLACE FUNCTION public.log_admin_activity(
  action_type TEXT,
  target_type TEXT DEFAULT NULL,
  target_id UUID DEFAULT NULL,
  details JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  activity_id UUID;
BEGIN
  -- Only allow admins to log activities
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  INSERT INTO public.admin_activities (
    admin_id,
    action_type,
    target_type,
    target_id,
    details
  ) VALUES (
    auth.uid(),
    action_type,
    target_type,
    target_id,
    details
  ) RETURNING id INTO activity_id;

  RETURN activity_id;
END;
$$;
