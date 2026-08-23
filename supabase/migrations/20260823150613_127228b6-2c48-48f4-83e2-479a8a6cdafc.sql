-- DISEASE SCANS: prepare for real model output
ALTER TABLE public.disease_scans
  ADD COLUMN IF NOT EXISTS farm_id uuid REFERENCES public.farms(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS model_version text,
  ADD COLUMN IF NOT EXISTS scanned_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS raw_predictions jsonb;

CREATE INDEX IF NOT EXISTS idx_scans_farm ON public.disease_scans(farm_id);
CREATE INDEX IF NOT EXISTS idx_scans_crop ON public.disease_scans(crop_id);
CREATE INDEX IF NOT EXISTS idx_scans_owner_time ON public.disease_scans(owner_id, scanned_at DESC);

-- CROPS
CREATE INDEX IF NOT EXISTS idx_crops_owner ON public.crops(owner_id);

-- MARKET DATA: dedupe + lookup indexes
CREATE UNIQUE INDEX IF NOT EXISTS uq_market_data_point
  ON public.market_data (crop_name, state, coalesce(district,''), coalesce(market_name,''), price_date);
CREATE INDEX IF NOT EXISTS idx_market_lookup ON public.market_data (crop_name, state, price_date DESC);

-- MARKET PREDICTIONS (kept separate from historical data)
CREATE TABLE IF NOT EXISTS public.market_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_name text NOT NULL,
  state text NOT NULL,
  district text,
  market_name text,
  target_date date NOT NULL,
  predicted_price numeric NOT NULL,
  lower_bound numeric,
  upper_bound numeric,
  confidence numeric,
  model_version text NOT NULL DEFAULT 'demo-v0',
  is_demo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.market_predictions TO authenticated;
GRANT ALL ON public.market_predictions TO service_role;
ALTER TABLE public.market_predictions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "market predictions readable" ON public.market_predictions;
CREATE POLICY "market predictions readable" ON public.market_predictions
  FOR SELECT TO authenticated USING (true);
DROP TRIGGER IF EXISTS market_predictions_updated_at ON public.market_predictions;
CREATE TRIGGER market_predictions_updated_at BEFORE UPDATE ON public.market_predictions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE UNIQUE INDEX IF NOT EXISTS uq_market_prediction_point
  ON public.market_predictions (crop_name, state, coalesce(district,''), coalesce(market_name,''), target_date, model_version);

-- WEATHER DATA: real-API ready
ALTER TABLE public.weather_data
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision,
  ADD COLUMN IF NOT EXISTS rainfall_mm numeric,
  ADD COLUMN IF NOT EXISTS forecast_time timestamptz,
  ADD COLUMN IF NOT EXISTS retrieved_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS district text;
CREATE INDEX IF NOT EXISTS idx_weather_location_date ON public.weather_data (location_name, recorded_for DESC);
CREATE INDEX IF NOT EXISTS idx_weather_farm ON public.weather_data (farm_id);

-- EQUIPMENT
ALTER TABLE public.equipment
  ADD COLUMN IF NOT EXISTS image_urls text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS rating_count integer NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_equipment_owner ON public.equipment(owner_id);
CREATE INDEX IF NOT EXISTS idx_equipment_discovery ON public.equipment(category, state, district) WHERE is_available;

-- BOOKINGS
ALTER TABLE public.equipment_bookings
  ADD COLUMN IF NOT EXISTS start_time timestamptz,
  ADD COLUMN IF NOT EXISTS end_time timestamptz,
  ADD COLUMN IF NOT EXISTS payment_reference text,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid';
CREATE INDEX IF NOT EXISTS idx_bookings_equipment ON public.equipment_bookings(equipment_id, start_date);

-- ADVISORIES: location / crop / validity association
ALTER TABLE public.advisories
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS district text,
  ADD COLUMN IF NOT EXISTS valid_from date,
  ADD COLUMN IF NOT EXISTS valid_to date;
CREATE INDEX IF NOT EXISTS idx_advisories_scope ON public.advisories(language, category, crop_name);

-- NOTIFICATIONS
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, created_at DESC);

-- LOAN ADVISOR (non-sensitive eligibility inputs only)
CREATE TABLE IF NOT EXISTS public.loan_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_id uuid REFERENCES public.farms(id) ON DELETE SET NULL,
  land_area numeric,
  land_unit text NOT NULL DEFAULT 'acre',
  primary_crop text,
  farming_experience_years integer,
  annual_income_band text,
  has_existing_loan boolean NOT NULL DEFAULT false,
  readiness_score integer,
  indicative_amount numeric,
  result_summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.loan_assessments TO authenticated;
GRANT ALL ON public.loan_assessments TO service_role;
ALTER TABLE public.loan_assessments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own loan assessments" ON public.loan_assessments;
CREATE POLICY "own loan assessments" ON public.loan_assessments
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "admin read loan assessments" ON public.loan_assessments;
CREATE POLICY "admin read loan assessments" ON public.loan_assessments
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS loan_assessments_updated_at ON public.loan_assessments;
CREATE TRIGGER loan_assessments_updated_at BEFORE UPDATE ON public.loan_assessments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX IF NOT EXISTS idx_loan_user ON public.loan_assessments(user_id, created_at DESC);

-- NOTIFICATIONS/ADMIN read access for equipment bookings already covered by existing policies.