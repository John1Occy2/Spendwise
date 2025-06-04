CREATE TABLE IF NOT EXISTS linked_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('bank', 'mobile_wallet', 'credit_card')),
  provider_name VARCHAR(100) NOT NULL,
  account_name VARCHAR(200) NOT NULL,
  account_number_masked VARCHAR(50),
  account_id VARCHAR(200) UNIQUE NOT NULL,
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  balance DECIMAL(12,2),
  currency VARCHAR(3) DEFAULT 'USD',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_linked_accounts_user_id ON linked_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_linked_accounts_account_type ON linked_accounts(account_type);
CREATE INDEX IF NOT EXISTS idx_linked_accounts_provider ON linked_accounts(provider_name);

CREATE TABLE IF NOT EXISTS account_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  linked_account_id UUID REFERENCES linked_accounts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  transaction_id VARCHAR(200) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
  category VARCHAR(100),
  merchant_name VARCHAR(200),
  is_pending BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(linked_account_id, transaction_id)
);

CREATE INDEX IF NOT EXISTS idx_account_transactions_user_id ON account_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_account_transactions_account_id ON account_transactions(linked_account_id);
CREATE INDEX IF NOT EXISTS idx_account_transactions_date ON account_transactions(transaction_date);

alter publication supabase_realtime add table linked_accounts;
alter publication supabase_realtime add table account_transactions;