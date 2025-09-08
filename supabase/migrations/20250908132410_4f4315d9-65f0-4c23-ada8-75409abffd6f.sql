-- Check what triggers exist and where they are attached
SELECT 
    schemaname,
    tablename,
    triggername,
    definition
FROM pg_triggers 
WHERE triggername LIKE '%handle_new_user%' OR triggername LIKE '%user_role%';

-- Also check if there are any other triggers on auth.users
SELECT 
    schemaname,
    tablename,
    triggername,
    definition
FROM pg_triggers 
WHERE schemaname = 'auth' AND tablename = 'users';