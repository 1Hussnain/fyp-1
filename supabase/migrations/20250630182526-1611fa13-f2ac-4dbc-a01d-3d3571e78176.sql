
-- Update authorized admin emails to include your email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  authorized_admin_emails TEXT[] := ARRAY[
    'muhammadhassnainn@gmail.com',
    'admin@company.com',
    'superadmin@company.com'
  ];
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

  -- Give user default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Only assign admin role if email is in authorized list
  IF NEW.email = ANY(authorized_admin_emails) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Log the admin assignment
    INSERT INTO public.admin_activities (admin_id, action_type, target_type, target_id, details)
    VALUES (NEW.id, 'admin_role_auto_assigned', 'user', NEW.id, jsonb_build_object('email', NEW.email));
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE WARNING 'Profile creation failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Add missing RLS policies for admin access
DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;
CREATE POLICY "Admins can view all user roles" 
ON public.user_roles 
FOR SELECT 
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
CREATE POLICY "Admins can manage user roles" 
ON public.user_roles 
FOR ALL 
USING (public.is_admin());

-- Ensure admin activities table has proper policies
DROP POLICY IF EXISTS "Admins can view all activities" ON public.admin_activities;
CREATE POLICY "Admins can view all activities" 
ON public.admin_activities 
FOR SELECT 
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can log activities" ON public.admin_activities;
CREATE POLICY "Admins can log activities" 
ON public.admin_activities 
FOR INSERT 
WITH CHECK (public.is_admin() AND admin_id = auth.uid());

-- If you want to manually assign admin role to existing user with your email
DO $$
BEGIN
  -- Check if user with your email exists and assign admin role
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'muhammadhassnainn@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    SELECT id, 'admin'::app_role 
    FROM auth.users 
    WHERE email = 'muhammadhassnainn@gmail.com'
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
