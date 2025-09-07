-- Assign super admin privileges to your account
UPDATE public.profiles 
SET user_type = 'admin' 
WHERE email = 'k.pajak.pjx@gmail.com';

-- Ensure admin role is assigned
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'admin' 
FROM public.profiles 
WHERE email = 'k.pajak.pjx@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify the admin assignment
INSERT INTO public.notifications (user_id, title, message, type)
SELECT user_id, 'Super Admin Access Granted', 'You now have full administrator privileges across the entire platform.', 'success'
FROM public.profiles 
WHERE email = 'k.pajak.pjx@gmail.com';