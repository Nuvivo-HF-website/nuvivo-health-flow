-- Create simple encoding functions for message content (base64 encoding)
-- Note: This provides basic obfuscation, not cryptographic encryption
-- For production, configure vault or use application-level encryption

CREATE OR REPLACE FUNCTION public.encode_message_content(content_text text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT encode(content_text::bytea, 'base64');
$$;

CREATE OR REPLACE FUNCTION public.decode_message_content(encoded_content text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT convert_from(decode(encoded_content, 'base64'), 'UTF8');
$$;

-- Update the messages_decrypted view to use the new functions
DROP VIEW IF EXISTS public.messages_decrypted;
CREATE VIEW public.messages_decrypted AS
SELECT 
  id,
  sender_id,
  recipient_id,
  related_result_id,
  public.decode_message_content(content) as content,
  created_at,
  read_at,
  updated_at
FROM public.messages;

-- Apply same RLS policies to the view
ALTER VIEW public.messages_decrypted SET (security_invoker = true);

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