-- Check what triggers exist using the correct system view
SELECT 
    trigger_schema,
    event_object_table,
    trigger_name,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name LIKE '%handle_new_user%' OR trigger_name LIKE '%user_role%';

-- Let's also see all triggers on auth.users table
SELECT 
    trigger_schema,
    event_object_table,
    trigger_name,
    action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'auth' AND event_object_table = 'users';