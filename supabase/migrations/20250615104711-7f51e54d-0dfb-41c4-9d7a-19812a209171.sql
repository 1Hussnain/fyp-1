
-- Create the OTPs table for password resets
CREATE TABLE public.password_reset_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- (Optional) Create an index to speed up lookups. 
CREATE INDEX idx_password_reset_otps_email ON public.password_reset_otps(email);

