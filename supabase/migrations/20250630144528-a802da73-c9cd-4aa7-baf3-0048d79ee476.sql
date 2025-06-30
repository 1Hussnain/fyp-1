
-- Complete clean database schema rebuild
-- Drop existing tables in correct order to avoid foreign key conflicts
DROP TABLE IF EXISTS public.document_tags CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.folders CASCADE;
DROP TABLE IF EXISTS public.admin_activities CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.budgets CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.financial_goals CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.chat_history CASCADE;
DROP TABLE IF EXISTS public.preferences CASCADE;
DROP TABLE IF EXISTS public.milestones CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.tags CASCADE;
DROP TABLE IF EXISTS public.password_reset_otps CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS public.app_role CASCADE;

-- Create app_role type
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create profiles table (must be first since others reference it)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  first_name text,
  last_name text,
  full_name text,
  avatar_url text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  assigned_by uuid REFERENCES auth.users(id),
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create categories table
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  color text DEFAULT '#3B82F6',
  icon text DEFAULT 'DollarSign',
  budget numeric,
  is_system boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories(id),
  amount numeric NOT NULL,
  type text NOT NULL,
  description text,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create financial_goals table
CREATE TABLE public.financial_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  goal_type text NOT NULL,
  target_amount numeric NOT NULL,
  saved_amount numeric DEFAULT 0,
  deadline date,
  priority text DEFAULT 'medium',
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create budgets table
CREATE TABLE public.budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories(id),
  monthly_limit numeric NOT NULL,
  current_spent numeric DEFAULT 0,
  month integer NOT NULL,
  year integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category_id, month, year)
);

-- Create folders table
CREATE TABLE public.folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  folder_id uuid REFERENCES public.folders(id),
  name text NOT NULL,
  file_url text NOT NULL,
  file_type text,
  size_bytes bigint,
  deleted boolean DEFAULT false,
  uploaded_at timestamptz DEFAULT now()
);

-- Create chat_history table
CREATE TABLE public.chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender text NOT NULL,
  message text NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create preferences table
CREATE TABLE public.preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text DEFAULT 'system',
  language text DEFAULT 'en',
  notifications_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create admin_activities table
CREATE TABLE public.admin_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  target_type text,
  target_id uuid,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create remaining utility tables
CREATE TABLE public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE
);

CREATE TABLE public.document_tags (
  document_id uuid REFERENCES public.documents(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, tag_id)
);

CREATE TABLE public.milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  detail jsonb,
  triggered_at timestamptz DEFAULT now()
);

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.password_reset_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  otp_code text NOT NULL,
  expires_at timestamptz NOT NULL,
  is_used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create essential functions
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = COALESCE($1, auth.uid())
      AND role = 'admin'::app_role
  );
$$;

-- Create profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (
    id, 
    email, 
    first_name, 
    last_name, 
    full_name,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(
      NEW.raw_user_meta_data->>'full_name', 
      TRIM(CONCAT(
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''), 
        ' ', 
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
      ))
    ),
    'user'
  );

  -- Give user default role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Profile creation failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());

-- Categories policies
CREATE POLICY "Users can view their categories and system categories" ON public.categories FOR SELECT USING (user_id = auth.uid() OR is_system = true);
CREATE POLICY "Users can create their own categories" ON public.categories FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own categories" ON public.categories FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own categories" ON public.categories FOR DELETE USING (user_id = auth.uid());

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own transactions" ON public.transactions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own transactions" ON public.transactions FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own transactions" ON public.transactions FOR DELETE USING (user_id = auth.uid());

-- Goals policies
CREATE POLICY "Users can view their own goals" ON public.financial_goals FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own goals" ON public.financial_goals FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own goals" ON public.financial_goals FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own goals" ON public.financial_goals FOR DELETE USING (user_id = auth.uid());

-- Budgets policies
CREATE POLICY "Users can view their own budgets" ON public.budgets FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own budgets" ON public.budgets FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own budgets" ON public.budgets FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own budgets" ON public.budgets FOR DELETE USING (user_id = auth.uid());

-- Other table policies (similar pattern)
CREATE POLICY "Users can view their own folders" ON public.folders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own folders" ON public.folders FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own documents" ON public.documents FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own documents" ON public.documents FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own chat history" ON public.chat_history FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own chat history" ON public.chat_history FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own preferences" ON public.preferences FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own preferences" ON public.preferences FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own preferences" ON public.preferences FOR UPDATE USING (user_id = auth.uid());

-- Admin policies
CREATE POLICY "Admins can view all admin activities" ON public.admin_activities FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can create admin activities" ON public.admin_activities FOR INSERT WITH CHECK (public.is_admin());

-- Setup realtime
ALTER TABLE public.financial_goals REPLICA IDENTITY FULL;
ALTER TABLE public.transactions REPLICA IDENTITY FULL;
ALTER TABLE public.budgets REPLICA IDENTITY FULL;
ALTER TABLE public.categories REPLICA IDENTITY FULL;

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.financial_goals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.budgets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;

-- Insert some default system categories
INSERT INTO public.categories (name, type, color, icon, is_system) VALUES
('Food & Dining', 'expense', '#FF6B6B', 'Utensils', true),
('Transportation', 'expense', '#4ECDC4', 'Car', true),
('Shopping', 'expense', '#45B7D1', 'ShoppingBag', true),
('Entertainment', 'expense', '#96CEB4', 'Film', true),
('Bills & Utilities', 'expense', '#FFEAA7', 'Zap', true),
('Healthcare', 'expense', '#DDA0DD', 'Heart', true),
('Education', 'expense', '#98D8C8', 'BookOpen', true),
('Salary', 'income', '#6C5CE7', 'DollarSign', true),
('Freelance', 'income', '#A29BFE', 'Briefcase', true),
('Investment', 'income', '#FD79A8', 'TrendingUp', true);
