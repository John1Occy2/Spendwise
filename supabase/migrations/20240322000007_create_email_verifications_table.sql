CREATE TABLE IF NOT EXISTS email_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index on email to allow upsert
CREATE UNIQUE INDEX IF NOT EXISTS email_verifications_email_idx ON email_verifications(email);

-- Create index on expires_at for cleanup
CREATE INDEX IF NOT EXISTS email_verifications_expires_at_idx ON email_verifications(expires_at);

-- Enable realtime
alter publication supabase_realtime add table email_verifications;
