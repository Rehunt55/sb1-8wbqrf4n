/*
# Create portfolio_transactions table (single-tenant, no auth)

1. New Tables
- `portfolio_transactions`
  - `id` (uuid, primary key)
  - `asset_symbol` (text, not null) — e.g. "Gram Altın", "USD/TRY", "BTC"
  - `asset_type` (text, not null) — one of "gold", "forex", "crypto"
  - `action` (text, not null) — "buy" or "sell"
  - `amount` (numeric, not null) — quantity bought or sold
  - `price` (numeric, not null) — unit price in TRY at time of transaction
  - `date` (date, not null) — user-entered date of the transaction
  - `note` (text, nullable) — optional user note
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `portfolio_transactions`.
- This is a single-tenant app with no sign-in screen, so all CRUD is allowed
  for both anon and authenticated roles (intentionally public/shared data).

3. Notes
- No user_id column — the app has no authentication flow.
- Policies use USING (true) / WITH CHECK (true) because the data is
  intentionally shared in this single-tenant demo app.
- The app computes average cost, total holdings, and P/L from the
  transaction history in the frontend.
*/

CREATE TABLE IF NOT EXISTS portfolio_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_symbol text NOT NULL,
  asset_type text NOT NULL CHECK (asset_type IN ('gold', 'forex', 'crypto')),
  action text NOT NULL CHECK (action IN ('buy', 'sell')),
  amount numeric NOT NULL CHECK (amount > 0),
  price numeric NOT NULL CHECK (price > 0),
  date date NOT NULL DEFAULT CURRENT_DATE,
  note text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE portfolio_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_tx" ON portfolio_transactions;
CREATE POLICY "anon_select_tx" ON portfolio_transactions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_tx" ON portfolio_transactions;
CREATE POLICY "anon_insert_tx" ON portfolio_transactions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_tx" ON portfolio_transactions;
CREATE POLICY "anon_update_tx" ON portfolio_transactions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_tx" ON portfolio_transactions;
CREATE POLICY "anon_delete_tx" ON portfolio_transactions FOR DELETE
  TO anon, authenticated USING (true);
