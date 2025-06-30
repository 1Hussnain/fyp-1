
-- Fix the is_admin function conflict by dropping the duplicate and keeping only one clean version
DROP FUNCTION IF EXISTS public.is_admin();

-- Create a single, clean is_admin function
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

-- Ensure RLS policies on profiles table are clean
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create clean RLS policies for profiles
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin());

-- Fix the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert profile with better error handling
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

  -- Give new users the default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE WARNING 'Profile creation failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Clean up realtime subscriptions and ensure proper setup
ALTER TABLE public.financial_goals REPLICA IDENTITY FULL;
ALTER TABLE public.transactions REPLICA IDENTITY FULL;
ALTER TABLE public.budgets REPLICA IDENTITY FULL;

-- Safely add tables to realtime publication
DO $$
BEGIN
  -- Remove and re-add to ensure clean state
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.financial_goals;
  EXCEPTION
    WHEN OTHERS THEN NULL;
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.transactions;
  EXCEPTION
    WHEN OTHERS THEN NULL;
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.budgets;
  EXCEPTION
    WHEN OTHERS THEN NULL;
  END;

  -- Add them back
  ALTER PUBLICATION supabase_realtime ADD TABLE public.financial_goals;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.budgets;
END $$;
