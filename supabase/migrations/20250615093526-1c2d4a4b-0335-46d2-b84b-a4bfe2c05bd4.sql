
-- 1. Add a "budget" column to categories table, if not already present
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS budget numeric;

-- 2. Enable RLS (Row Level Security) on the categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow users to SELECT their own categories or system categories
CREATE POLICY "Users can view their categories and system categories"
ON public.categories
FOR SELECT
USING (
  user_id = auth.uid() OR is_system = true
);

-- 4. Policy: Allow users to INSERT their own categories
CREATE POLICY "Users can create their own categories"
ON public.categories
FOR INSERT
WITH CHECK (
  user_id = auth.uid()
);

-- 5. Policy: Allow users to UPDATE their own categories
CREATE POLICY "Users can update their own categories"
ON public.categories
FOR UPDATE
USING (
  user_id = auth.uid()
);

-- 6. Policy: Allow users to DELETE their own categories
CREATE POLICY "Users can delete their own categories"
ON public.categories
FOR DELETE
USING (
  user_id = auth.uid()
);

