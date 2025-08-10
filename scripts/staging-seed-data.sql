-- Staging Environment Test Data Setup
-- This script creates realistic fake health data for preview/staging testing

-- Create test users (these will need to be created via Supabase Auth first)
-- Test patient IDs (replace with actual UUIDs from staging auth.users)
-- Patient 1: test-patient-1@staging.com
-- Patient 2: test-patient-2@staging.com
-- Patient 3: test-patient-3@staging.com
-- Patient 4: test-patient-4@staging.com
-- Patient 5: test-patient-5@staging.com
-- Staff 1: test-doctor-1@staging.com
-- Staff 2: test-nurse-1@staging.com
-- Staff 3: test-specialist-1@staging.com
-- Admin: test-admin-1@staging.com

-- Insert test profiles (replace UUIDs with actual staging user IDs)
INSERT INTO public.profiles (user_id, email, full_name, ai_consent, user_type, consent_timestamp, consent_version) VALUES 
('00000000-0000-0000-0000-000000000001', 'test-patient-1@staging.com', 'John Smith Test', true, 'patient', now(), 'v1.0'),
('00000000-0000-0000-0000-000000000002', 'test-patient-2@staging.com', 'Sarah Jones Test', false, 'patient', now(), 'v1.0'),
('00000000-0000-0000-0000-000000000003', 'test-patient-3@staging.com', 'Michael Brown Test', true, 'patient', now(), 'v1.0'),
('00000000-0000-0000-0000-000000000004', 'test-patient-4@staging.com', 'Emma Wilson Test', true, 'patient', now(), 'v1.0'),
('00000000-0000-0000-0000-000000000005', 'test-patient-5@staging.com', 'David Taylor Test', false, 'patient', now(), 'v1.0'),
('00000000-0000-0000-0000-000000000006', 'test-doctor-1@staging.com', 'Dr. Helen Watson', true, 'doctor', now(), 'v1.0'),
('00000000-0000-0000-0000-000000000007', 'test-nurse-1@staging.com', 'Nurse Tom Clarke', true, 'nurse', now(), 'v1.0'),
('00000000-0000-0000-0000-000000000008', 'test-specialist-1@staging.com', 'Dr. Lisa Chen', true, 'specialist', now(), 'v1.0'),
('00000000-0000-0000-0000-000000000009', 'test-admin-1@staging.com', 'Admin Test User', true, 'admin', now(), 'v1.0');

-- Insert user roles
INSERT INTO public.user_roles (user_id, role) VALUES 
('00000000-0000-0000-0000-000000000001', 'patient'),
('00000000-0000-0000-0000-000000000002', 'patient'),
('00000000-0000-0000-0000-000000000003', 'patient'),
('00000000-0000-0000-0000-000000000004', 'patient'),
('00000000-0000-0000-0000-000000000005', 'patient'),
('00000000-0000-0000-0000-000000000006', 'doctor'),
('00000000-0000-0000-0000-000000000007', 'doctor'),
('00000000-0000-0000-0000-000000000008', 'doctor'),
('00000000-0000-0000-0000-000000000009', 'admin');

-- Insert patient profiles with realistic but fake NHS-style data
INSERT INTO public.patient_profiles (
  user_id, first_name, last_name, date_of_birth, gender, nhs_number, 
  address_line_1, city, postcode, country, phone, 
  medical_conditions, allergies, current_medications,
  consent_data_processing, consent_marketing, research_consent, data_retention_consent
) VALUES 
(
  '00000000-0000-0000-0000-000000000001', 'John', 'Smith Test', '1985-03-15', 'Male', 'NHS123456789',
  '123 Test Street', 'Manchester', 'M1 1AA', 'United Kingdom', '+44 7700 900123',
  ARRAY['Hypertension', 'Type 2 Diabetes'], ARRAY['Penicillin', 'Shellfish'], ARRAY['Metformin 500mg', 'Lisinopril 10mg'],
  true, false, true, true
),
(
  '00000000-0000-0000-0000-000000000002', 'Sarah', 'Jones Test', '1990-07-22', 'Female', 'NHS987654321',
  '456 Demo Avenue', 'Birmingham', 'B2 2BB', 'United Kingdom', '+44 7700 900124',
  ARRAY['Asthma'], ARRAY['Latex'], ARRAY['Salbutamol Inhaler'],
  true, true, false, true
),
(
  '00000000-0000-0000-0000-000000000003', 'Michael', 'Brown Test', '1978-11-08', 'Male', 'NHS456789123',
  '789 Sample Road', 'Leeds', 'LS3 3CC', 'United Kingdom', '+44 7700 900125',
  ARRAY['High Cholesterol'], ARRAY[], ARRAY['Atorvastatin 20mg'],
  true, false, true, true
),
(
  '00000000-0000-0000-0000-000000000004', 'Emma', 'Wilson Test', '1995-01-30', 'Female', 'NHS789123456',
  '321 Mock Lane', 'Liverpool', 'L4 4DD', 'United Kingdom', '+44 7700 900126',
  ARRAY[], ARRAY['Peanuts'], ARRAY[],
  true, true, true, true
),
(
  '00000000-0000-0000-0000-000000000005', 'David', 'Taylor Test', '1972-09-12', 'Male', 'NHS321654987',
  '654 Test Close', 'Newcastle', 'NE5 5EE', 'United Kingdom', '+44 7700 900127',
  ARRAY['Arthritis', 'COPD'], ARRAY['Aspirin'], ARRAY['Ibuprofen 400mg', 'Salbutamol'],
  false, false, false, false
);

-- Insert realistic test results with NHS-style formatting
INSERT INTO public.test_results (
  user_id, test_name, test_type, test_date, 
  result_values, reference_ranges, result_status, status,
  clinic_name, doctor_name, order_id
) VALUES 
-- Patient 1 - John Smith Test
(
  '00000000-0000-0000-0000-000000000001', 'Full Blood Count', 'Haematology', '2024-01-15',
  '{"WBC": 7.2, "RBC": 4.5, "Haemoglobin": 145, "Platelets": 250, "MCV": 88}',
  '{"WBC": "4.0-11.0", "RBC": "4.5-5.9", "Haemoglobin": "130-170", "Platelets": "150-400", "MCV": "82-98"}',
  'normal', 'completed', 'Test Medical Centre', 'Dr. Smith', 'ORD001'
),
(
  '00000000-0000-0000-0000-000000000001', 'Lipid Profile', 'Biochemistry', '2024-01-15',
  '{"Cholesterol": 6.2, "HDL": 1.1, "LDL": 4.8, "Triglycerides": 2.1}',
  '{"Cholesterol": "<5.0", "HDL": ">1.0", "LDL": "<3.0", "Triglycerides": "<1.7"}',
  'abnormal', 'completed', 'Test Medical Centre', 'Dr. Smith', 'ORD001'
),
(
  '00000000-0000-0000-0000-000000000001', 'HbA1c', 'Biochemistry', '2024-01-15',
  '{"HbA1c": 58}',
  '{"HbA1c": "<42"}',
  'abnormal', 'completed', 'Test Medical Centre', 'Dr. Smith', 'ORD001'
),

-- Patient 2 - Sarah Jones Test
(
  '00000000-0000-0000-0000-000000000002', 'Full Blood Count', 'Haematology', '2024-01-20',
  '{"WBC": 8.1, "RBC": 4.2, "Haemoglobin": 125, "Platelets": 320, "MCV": 85}',
  '{"WBC": "4.0-11.0", "RBC": "3.8-5.2", "Haemoglobin": "115-155", "Platelets": "150-400", "MCV": "82-98"}',
  'normal', 'completed', 'Demo Health Clinic', 'Dr. Johnson', 'ORD002'
),
(
  '00000000-0000-0000-0000-000000000002', 'Thyroid Function', 'Biochemistry', '2024-01-20',
  '{"TSH": 2.5, "FT4": 15.2, "FT3": 4.8}',
  '{"TSH": "0.4-4.0", "FT4": "9.0-19.0", "FT3": "2.6-5.7"}',
  'normal', 'completed', 'Demo Health Clinic', 'Dr. Johnson', 'ORD002'
),

-- Patient 3 - Michael Brown Test
(
  '00000000-0000-0000-0000-000000000003', 'Lipid Profile', 'Biochemistry', '2024-01-25',
  '{"Cholesterol": 7.8, "HDL": 0.9, "LDL": 5.2, "Triglycerides": 3.4}',
  '{"Cholesterol": "<5.0", "HDL": ">1.0", "LDL": "<3.0", "Triglycerides": "<1.7"}',
  'abnormal', 'completed', 'Sample Medical Practice', 'Dr. Brown', 'ORD003'
),
(
  '00000000-0000-0000-0000-000000000003', 'Liver Function', 'Biochemistry', '2024-01-25',
  '{"ALT": 45, "AST": 38, "Bilirubin": 18, "ALP": 95}',
  '{"ALT": "<40", "AST": "<40", "Bilirubin": "<21", "ALP": "30-130"}',
  'borderline', 'completed', 'Sample Medical Practice', 'Dr. Brown', 'ORD003'
);

-- Insert care team relationships (staff assigned to patients)
INSERT INTO public.care_team (user_id, provider_id, provider_type, relationship_type, access_level) VALUES 
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'doctor', 'primary_care', 'full'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000007', 'nurse', 'care_coordinator', 'view'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000006', 'doctor', 'primary_care', 'full'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000008', 'specialist', 'cardiology', 'full'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000007', 'nurse', 'primary_care', 'view'),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000008', 'specialist', 'respiratory', 'full');

-- Insert test appointments
INSERT INTO public.appointments (
  user_id, doctor_id, appointment_type, appointment_date, status, duration_minutes, notes
) VALUES 
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'follow_up', '2024-02-15 10:00:00+00', 'scheduled', 30, 'Review diabetes management'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000006', 'routine_check', '2024-02-16 14:00:00+00', 'scheduled', 20, 'Annual health check'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000008', 'consultation', '2024-02-17 11:00:00+00', 'scheduled', 45, 'Cardiology review'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000007', 'health_check', '2024-02-18 09:00:00+00', 'scheduled', 15, 'General wellness check'),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000008', 'follow_up', '2024-02-19 15:00:00+00', 'scheduled', 30, 'COPD management review');

-- Insert test messages between staff and patients
INSERT INTO public.messages (sender_id, recipient_id, content, related_result_id) VALUES 
('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 
 encode('Your recent blood tests show good diabetes control. Please continue current medication.', 'base64'), NULL),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 
 encode('Thank you doctor. Should I continue the same diet plan?', 'base64'), NULL),
('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003', 
 encode('Your cholesterol levels are elevated. I recommend starting statin therapy.', 'base64'), NULL),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000008', 
 encode('I understand. Are there any dietary changes I should make as well?', 'base64'), NULL);

-- Insert test medications
INSERT INTO public.medications (
  user_id, medication_name, dosage, frequency, start_date, prescribed_by, status
) VALUES 
('00000000-0000-0000-0000-000000000001', 'Metformin', '500mg', 'Twice daily', '2023-06-01', 'Dr. Watson', 'active'),
('00000000-0000-0000-0000-000000000001', 'Lisinopril', '10mg', 'Once daily', '2023-06-01', 'Dr. Watson', 'active'),
('00000000-0000-0000-0000-000000000002', 'Salbutamol Inhaler', '100mcg', 'As needed', '2023-08-15', 'Dr. Johnson', 'active'),
('00000000-0000-0000-0000-000000000003', 'Atorvastatin', '20mg', 'Once daily', '2024-01-25', 'Dr. Chen', 'active'),
('00000000-0000-0000-0000-000000000005', 'Ibuprofen', '400mg', 'Three times daily', '2023-12-10', 'Dr. Chen', 'active');

-- Insert test health goals
INSERT INTO public.health_goals (
  user_id, goal_type, title, description, target_value, target_unit, target_date, status
) VALUES 
('00000000-0000-0000-0000-000000000001', 'weight_loss', 'Reduce Weight', 'Lose 10kg for better diabetes control', 80, 'kg', '2024-06-01', 'active'),
('00000000-0000-0000-0000-000000000001', 'exercise', 'Daily Walk', 'Walk 30 minutes daily', 30, 'minutes', '2024-12-31', 'active'),
('00000000-0000-0000-0000-000000000002', 'fitness', 'Improve Cardio', 'Increase cardio fitness', 150, 'minutes_per_week', '2024-08-01', 'active'),
('00000000-0000-0000-0000-000000000003', 'cholesterol', 'Lower Cholesterol', 'Reduce total cholesterol below 5.0', 5.0, 'mmol/L', '2024-04-01', 'active');

-- Log initial test data creation
SELECT public.log_gdpr_action(
  '00000000-0000-0000-0000-000000000009', 
  'TEST_DATA_CREATED', 
  'staging_environment', 
  NULL, 
  NULL, 
  NULL, 
  'SYSTEM_SETUP'
);