-- Enable pgcrypto extension for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create messages table with encrypted content
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  related_result_id uuid,
  content text NOT NULL, -- Will be encrypted using pgcrypto
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  read_at timestamp with time zone,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create message audit logs table
CREATE TABLE public.message_audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('sent', 'read')),
  actor_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_messages_sender_recipient ON public.messages (sender_id, recipient_id);
CREATE INDEX idx_messages_created_at ON public.messages (created_at DESC);
CREATE INDEX idx_message_audit_logs_message_id ON public.message_audit_logs (message_id);

-- RLS policies for messages table
CREATE POLICY "Users can view messages they sent or received"
ON public.messages
FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create messages they are sending"
ON public.messages
FOR INSERT
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update read status of messages they received"
ON public.messages
FOR UPDATE
USING (auth.uid() = recipient_id)
WITH CHECK (auth.uid() = recipient_id);

CREATE POLICY "Admins can view all messages for audit purposes"
ON public.messages
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for message audit logs
CREATE POLICY "Users can view audit logs for their messages"
ON public.message_audit_logs
FOR SELECT
USING (
  message_id IN (
    SELECT id FROM public.messages 
    WHERE sender_id = auth.uid() OR recipient_id = auth.uid()
  )
);

CREATE POLICY "System can create audit logs"
ON public.message_audit_logs
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all audit logs"
ON public.message_audit_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to encrypt message content
CREATE OR REPLACE FUNCTION public.encrypt_message_content(content_text text)
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT encode(pgp_sym_encrypt(content_text, 'secure_message_key_2024'), 'base64');
$$;

-- Function to decrypt message content
CREATE OR REPLACE FUNCTION public.decrypt_message_content(encrypted_content text)
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT pgp_sym_decrypt(decode(encrypted_content, 'base64'), 'secure_message_key_2024');
$$;

-- Function to log message actions
CREATE OR REPLACE FUNCTION public.log_message_action(
  _message_id uuid,
  _action text,
  _actor_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.message_audit_logs (message_id, action, actor_id)
  VALUES (_message_id, _action, _actor_id);
END;
$$;

-- Trigger to automatically log message creation
CREATE OR REPLACE FUNCTION public.log_message_sent()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM public.log_message_action(NEW.id, 'sent', NEW.sender_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER log_message_sent_trigger
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.log_message_sent();

-- Trigger to log when messages are read
CREATE OR REPLACE FUNCTION public.log_message_read()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only log if read_at was just set (changed from null to a timestamp)
  IF OLD.read_at IS NULL AND NEW.read_at IS NOT NULL THEN
    PERFORM public.log_message_action(NEW.id, 'read', NEW.recipient_id);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER log_message_read_trigger
  AFTER UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.log_message_read();

-- Add foreign key references (linking to auth.users via user_id pattern)
ALTER TABLE public.messages 
ADD CONSTRAINT fk_messages_related_result 
FOREIGN KEY (related_result_id) REFERENCES public.results(id);

-- Create a view for easier message querying with decrypted content
CREATE VIEW public.messages_decrypted AS
SELECT 
  id,
  sender_id,
  recipient_id,
  related_result_id,
  public.decrypt_message_content(content) as content,
  created_at,
  read_at,
  updated_at
FROM public.messages;

-- Apply same RLS policies to the view
ALTER VIEW public.messages_decrypted SET (security_invoker = true);

-- Update updated_at trigger for messages
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();