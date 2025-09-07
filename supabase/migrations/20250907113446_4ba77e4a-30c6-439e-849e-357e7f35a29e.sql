-- Update the user profile to doctor type
UPDATE public.profiles 
SET user_type = 'doctor' 
WHERE email = 'konradinparadise@gmail.com';

-- Update the user role to doctor
UPDATE public.user_roles 
SET role = 'doctor' 
WHERE user_id = '4c19f506-0a92-4639-9223-1303cb53b69e';

-- If no role exists, insert it
INSERT INTO public.user_roles (user_id, role)
SELECT '4c19f506-0a92-4639-9223-1303cb53b69e', 'doctor'
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = '4c19f506-0a92-4639-9223-1303cb53b69e'
);