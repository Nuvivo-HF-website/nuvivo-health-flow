-- First ensure pgcrypto extension is enabled properly
DROP EXTENSION IF EXISTS pgcrypto CASCADE;
CREATE EXTENSION pgcrypto;

-- Fix encrypt_message_content function with explicit casts
CREATE OR REPLACE FUNCTION public.encrypt_message_content(content_text text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT encode(pgp_sym_encrypt(content_text::text, 'secure_message_key_2024'::text), 'base64');
$$;

-- Fix decrypt_message_content function with explicit casts
CREATE OR REPLACE FUNCTION public.decrypt_message_content(encrypted_content text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT pgp_sym_decrypt(decode(encrypted_content, 'base64'), 'secure_message_key_2024'::text);
$$;

-- Fix log_message_action function
CREATE OR REPLACE FUNCTION public.log_message_action(
  _message_id uuid,
  _action text,
  _actor_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.message_audit_logs (message_id, action, actor_id)
  VALUES (_message_id, _action, _actor_id);
END;
$$;

-- Fix log_message_sent function
CREATE OR REPLACE FUNCTION public.log_message_sent()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM public.log_message_action(NEW.id, 'sent', NEW.sender_id);
  RETURN NEW;
END;
$$;

-- Fix log_message_read function
CREATE OR REPLACE FUNCTION public.log_message_read()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only log if read_at was just set (changed from null to a timestamp)
  IF OLD.read_at IS NULL AND NEW.read_at IS NOT NULL THEN
    PERFORM public.log_message_action(NEW.id, 'read', NEW.recipient_id);
  END IF;
  RETURN NEW;
END;
$$;