/*
# Create price_alerts table (single-tenant, no auth)

1. New Tables
- `price_alerts`
  - `id` (uuid, primary key)
  - `asset_symbol` (text, not null) — e.g. "USD/TRY", "Gram Altın", "BTC"
  - `asset_type` (text, not null) — one of "forex", "gold", "crypto"
  - `target_price` (numeric, not null) — the price threshold the user wants to be notified at
  - `direction` (text, not null) — "above" or "below"
  - `triggered` (boolean, default false) — whether the alert has fired
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `price_alerts`.
- This is a single-tenant app with no sign-in screen, so all CRUD is allowed
  for both anon and authenticated roles (intentionally public/shared data).

3. Notes
- No user_id column — the app has no authentication flow.
- Policies use USING (true) / WITH CHECK (true) because the data is
  intentionally shared in this single-tenant demo app.
*/

CREATE TABLE IF NOT EXISTS price_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_symbol text NOT NULL,
  asset_type text NOT NULL CHECK (asset_type IN ('forex', 'gold', 'crypto')),
  target_price numeric NOT NULL,
  direction text NOT NULL CHECK (direction IN ('above', 'below')),
  triggered boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_alerts" ON price_alerts;
CREATE POLICY "anon_select_alerts" ON price_alerts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_alerts" ON price_alerts;
CREATE POLICY "anon_insert_alerts" ON price_alerts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_alerts" ON price_alerts;
CREATE POLICY "anon_update_alerts" ON price_alerts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_alerts" ON price_alerts;
CREATE POLICY "anon_delete_alerts" ON price_alerts FOR DELETE
  TO anon, authenticated USING (true);
