-- Create the marketplace_providers view that the frontend expects
CREATE OR REPLACE VIEW marketplace_providers AS
SELECT
  dp.id,
  dp.user_id,
  dp.profession as dp_profession,
  dp.specializations,
  dp.consultation_fee,
  dp.years_of_experience,
  dp.bio,
  dp.clinic_name,
  dp.available_days,
  dp.available_hours,
  p.full_name,
  COALESCE(p.profession, dp.profession) as profession,
  p.avatar_url,
  COALESCE(NULLIF(p.address, ''), dp.clinic_name, 'UK') as location,
  p.city,
  p.country
FROM doctor_profiles dp
JOIN profiles p ON p.user_id = dp.user_id
WHERE dp.is_marketplace_ready = true
  AND dp.verification_status = 'approved'
  AND dp.is_active = true;