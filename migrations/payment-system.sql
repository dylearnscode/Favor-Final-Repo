-- Payment system migration

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'credit_card', 'debit_card', 'bank_account', etc.
  last_four TEXT NOT NULL,
  expiry_date TEXT, -- Format: MM/YY
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for payment_methods
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment methods"
ON payment_methods FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods"
ON payment_methods FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods"
ON payment_methods FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods"
ON payment_methods FOR DELETE
USING (auth.uid() = user_id);

-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  fee NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
  payment_method_id UUID REFERENCES payment_methods(id),
  payment_provider TEXT NOT NULL, -- 'stripe', 'paypal', etc.
  payment_provider_id TEXT, -- ID from the payment provider
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for payment_transactions
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment transactions"
ON payment_transactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM transactions t
    WHERE t.id = payment_transactions.transaction_id
    AND (t.buyer_id = auth.uid() OR t.seller_id = auth.uid())
  )
);

-- Add escrow field to transactions table
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS in_escrow BOOLEAN DEFAULT true;

-- Add payment_transaction_id to transactions table
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS payment_transaction_id UUID REFERENCES payment_transactions(id);

-- Create function to release funds from escrow
CREATE OR REPLACE FUNCTION release_funds_from_escrow()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.buyer_confirmed = true AND NEW.seller_confirmed = true AND NEW.in_escrow = true THEN
    -- Update transaction
    NEW.in_escrow := false;
    NEW.status := 'completed';
    NEW.updated_at := NOW();
    
    -- Update payment transaction
    UPDATE payment_transactions
    SET status = 'completed', updated_at = NOW()
    WHERE id = NEW.payment_transaction_id;
    
    -- Create notification for seller
    INSERT INTO notifications (user_id, content, type, related_id, is_read)
    VALUES (NEW.seller_id, 'Payment for your service has been released', 'payment', NEW.id, false);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for releasing funds
DROP TRIGGER IF EXISTS release_funds_trigger ON transactions;
CREATE TRIGGER release_funds_trigger
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION release_funds_from_escrow();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_transaction_id ON payment_transactions(transaction_id);
