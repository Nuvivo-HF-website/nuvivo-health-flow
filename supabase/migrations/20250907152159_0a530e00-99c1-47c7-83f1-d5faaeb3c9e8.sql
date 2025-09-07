-- Insert existing doctors into specialists table
INSERT INTO public.specialists (
    user_id,
    specialty,
    experience_years,
    consultation_fee,
    consultation_duration,
    available_hours,
    available_days,
    is_active,
    bio,
    qualifications
) 
SELECT 
    p.user_id,
    'General Practice',  -- Default specialty
    5,  -- Default 5 years experience
    150.00,  -- Default consultation fee in GBP
    30,  -- Default 30 minute consultation
    '{"start": "09:00", "end": "17:00"}'::jsonb,  -- Default working hours
    ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],  -- Default weekdays
    true,  -- Active by default
    'Experienced healthcare professional providing comprehensive medical care.',  -- Default bio
    ARRAY['MBBS', 'General Practice Certification']  -- Default qualifications
FROM public.profiles p
INNER JOIN public.user_roles ur ON p.user_id = ur.user_id
WHERE ur.role = 'doctor' 
AND p.user_id NOT IN (SELECT user_id FROM public.specialists);

-- Insert some services if they don't exist
INSERT INTO public.services (name, description, category, base_price, duration_minutes, is_active)
VALUES 
    ('General Consultation', 'Comprehensive health consultation and examination', 'consultation', 150.00, 30, true),
    ('Follow-up Consultation', 'Follow-up appointment for ongoing care', 'consultation', 100.00, 20, true),
    ('Health Check-up', 'Routine health screening and preventive care', 'screening', 200.00, 45, true)
ON CONFLICT (name) DO NOTHING;

-- Link specialists to default services
INSERT INTO public.specialist_services (specialist_id, service_id, is_available)
SELECT 
    s.id as specialist_id,
    srv.id as service_id,
    true as is_available
FROM public.specialists s
CROSS JOIN public.services srv
WHERE srv.name IN ('General Consultation', 'Follow-up Consultation', 'Health Check-up')
ON CONFLICT (specialist_id, service_id) DO NOTHING;