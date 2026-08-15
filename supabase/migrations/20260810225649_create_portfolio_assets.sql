/*
# Create portfolio_assets table (single-tenant, no auth)

1. New Tables
- `portfolio_assets`
  - `id` (uuid, primary key)
  - `asset_symbol` (text, not null) — e.g. "Gram Altın", "USD/TRY", "BTC"
  - `asset_type` (text, not null) — one of "gold", "forex", "crypto"
  - `amount` (numeric, not null) — quantity held by the user
  - `buy_price` (numeric, not null) — average purchase price in TRY
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `portfolio_assets`.
- This is a single-tenant app with no sign-in screen, so all CRUD is allowed
  for both anon and authenticated roles (intentionally public/shared data).

3. Notes
- No user_id column — the app has no authentication flow.
- Policies use USING (true) / WITH CHECK (true) because the data is
  intentionally shared in this single-tenant demo app.
*/

CREATE TABLE IF NOT EXISTS portfolio_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_symbol text NOT NULL,
  asset_type text NOT NULL CHECK (asset_type IN ('gold', 'forex', 'crypto')),
  amount numeric NOT NULL,
  buy_price numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE portfolio_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_portfolio" ON portfolio_assets;
CREATE POLICY "anon_select_portfolio" ON portfolio_assets FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_portfolio" ON portfolio_assets;
CREATE POLICY "anon_insert_portfolio" ON portfolio_assets FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_portfolio" ON portfolio_assets;
CREATE POLICY "anon_update_portfolio" ON portfolio_assets FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_portfolio" ON portfolio_assets;
CREATE POLICY "anon_delete_portfolio" ON portfolio_assets FOR DELETE
  TO anon, authenticated USING (true);
