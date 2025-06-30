
-- Update the handle_new_user function to only assign admin role to authorized emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  authorized_admin_emails TEXT[] := ARRAY[
    'admin@company.com',
    'superadmin@company.com'
    -- Add more authorized admin emails here
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

-- Create function to manually assign admin role (only admins can do this)
CREATE OR REPLACE FUNCTION public.assign_admin_role(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow existing admins to assign admin role
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Insert admin role
  INSERT INTO public.user_roles (user_id, role, assigned_by)
  VALUES (target_user_id, 'admin'::app_role, auth.uid())
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Log the admin assignment
  INSERT INTO public.admin_activities (admin_id, action_type, target_type, target_id, details)
  VALUES (auth.uid(), 'admin_role_assigned', 'user', target_user_id, jsonb_build_object('assigned_by', auth.uid()));

  RETURN TRUE;
END;
$$;

-- Create function to remove admin role (only admins can do this)
CREATE OR REPLACE FUNCTION public.remove_admin_role(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow existing admins to remove admin role
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Don't allow removing own admin role
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot remove your own admin role';
  END IF;

  -- Remove admin role
  DELETE FROM public.user_roles 
  WHERE user_id = target_user_id AND role = 'admin'::app_role;

  -- Log the admin removal
  INSERT INTO public.admin_activities (admin_id, action_type, target_type, target_id, details)
  VALUES (auth.uid(), 'admin_role_removed', 'user', target_user_id, jsonb_build_object('removed_by', auth.uid()));

  RETURN TRUE;
END;
$$;
