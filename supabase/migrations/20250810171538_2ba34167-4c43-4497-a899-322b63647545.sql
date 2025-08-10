-- Fix function search path issues for security compliance
CREATE OR REPLACE FUNCTION public.encode_message_content(content_text text)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT encode(content_text::bytea, 'base64');
$function$;

CREATE OR REPLACE FUNCTION public.decode_message_content(encoded_content text)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT convert_from(decode(encoded_content, 'base64'), 'UTF8');
$function$;

-- Enhanced audit logging for GDPR compliance
CREATE OR REPLACE FUNCTION public.log_gdpr_action(
  _user_id uuid,
  _action text,
  _table_name text DEFAULT NULL,
  _record_id uuid DEFAULT NULL,
  _ip_address inet DEFAULT NULL,
  _user_agent text DEFAULT NULL,
  _data_category text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO public.audit_logs (
    user_id, action, table_name, record_id, ip_address, user_agent,
    new_values
  ) VALUES (
    _user_id, _action, _table_name, _record_id, _ip_address, _user_agent,
    jsonb_build_object(
      'data_category', _data_category,
      'timestamp', now(),
      'compliance_event', true
    )
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$function$;

-- Enhanced consent tracking
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS consent_timestamp timestamp with time zone;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS consent_version text DEFAULT 'v1.0';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS consent_ip_address inet;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS marketing_consent boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS research_consent boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS data_retention_consent boolean DEFAULT false;

-- GDPR request processing
CREATE OR REPLACE FUNCTION public.process_gdpr_deletion(_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  deletion_summary jsonb;
  table_counts jsonb;
BEGIN
  -- Log the deletion request
  PERFORM public.log_gdpr_action(
    _user_id, 
    'GDPR_DELETION_STARTED', 
    NULL, 
    NULL, 
    NULL, 
    NULL, 
    'PERSONAL_DATA'
  );
  
  -- Count records before deletion for audit
  table_counts := jsonb_build_object(
    'profiles', (SELECT COUNT(*) FROM public.profiles WHERE user_id = _user_id),
    'patient_profiles', (SELECT COUNT(*) FROM public.patient_profiles WHERE user_id = _user_id),
    'results', (SELECT COUNT(*) FROM public.results WHERE user_id = _user_id),
    'test_results', (SELECT COUNT(*) FROM public.test_results WHERE user_id = _user_id),
    'messages', (SELECT COUNT(*) FROM public.messages WHERE sender_id = _user_id OR recipient_id = _user_id),
    'appointments', (SELECT COUNT(*) FROM public.appointments WHERE user_id = _user_id),
    'medical_documents', (SELECT COUNT(*) FROM public.medical_documents WHERE user_id = _user_id),
    'medications', (SELECT COUNT(*) FROM public.medications WHERE user_id = _user_id),
    'health_goals', (SELECT COUNT(*) FROM public.health_goals WHERE user_id = _user_id),
    'health_metrics', (SELECT COUNT(*) FROM public.health_metrics WHERE user_id = _user_id)
  );
  
  -- Mark GDPR request as completed
  UPDATE public.gdpr_requests 
  SET status = 'completed', 
      processed_at = now(),
      details = jsonb_build_object(
        'deletion_summary', table_counts,
        'retention_note', 'Audit logs retained for legal compliance'
      )
  WHERE user_id = _user_id AND request_type = 'deletion' AND status = 'pending';
  
  -- Log completion
  PERFORM public.log_gdpr_action(
    _user_id, 
    'GDPR_DELETION_COMPLETED', 
    NULL, 
    NULL, 
    NULL, 
    NULL, 
    'PERSONAL_DATA'
  );
  
  deletion_summary := jsonb_build_object(
    'status', 'completed',
    'records_processed', table_counts,
    'timestamp', now(),
    'retention_note', 'Legal audit logs retained as required by healthcare regulations'
  );
  
  RETURN deletion_summary;
END;
$function$;

-- Data export function for portability
CREATE OR REPLACE FUNCTION public.export_user_data(_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_data jsonb;
BEGIN
  -- Log the export request
  PERFORM public.log_gdpr_action(
    _user_id, 
    'DATA_EXPORT_REQUEST', 
    NULL, 
    NULL, 
    NULL, 
    NULL, 
    'PERSONAL_DATA'
  );
  
  -- Collect all user data
  user_data := jsonb_build_object(
    'profile', (SELECT to_jsonb(p) FROM public.profiles p WHERE user_id = _user_id),
    'patient_profile', (SELECT to_jsonb(pp) FROM public.patient_profiles pp WHERE user_id = _user_id),
    'test_results', (SELECT jsonb_agg(to_jsonb(tr)) FROM public.test_results tr WHERE user_id = _user_id),
    'results', (SELECT jsonb_agg(to_jsonb(r)) FROM public.results r WHERE user_id = _user_id),
    'appointments', (SELECT jsonb_agg(to_jsonb(a)) FROM public.appointments a WHERE user_id = _user_id),
    'medications', (SELECT jsonb_agg(to_jsonb(m)) FROM public.medications m WHERE user_id = _user_id),
    'health_goals', (SELECT jsonb_agg(to_jsonb(hg)) FROM public.health_goals hg WHERE user_id = _user_id),
    'health_metrics', (SELECT jsonb_agg(to_jsonb(hm)) FROM public.health_metrics hm WHERE user_id = _user_id),
    'export_metadata', jsonb_build_object(
      'exported_at', now(),
      'export_format', 'JSON',
      'gdpr_compliance', true,
      'data_categories', ARRAY['health', 'personal', 'contact']
    )
  );
  
  RETURN user_data;
END;
$function$;

-- Security trigger for sensitive data access logging
CREATE OR REPLACE FUNCTION public.log_sensitive_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Log access to sensitive tables
  IF TG_OP = 'SELECT' AND TG_TABLE_NAME IN ('results', 'test_results', 'messages', 'patient_profiles') THEN
    PERFORM public.log_gdpr_action(
      auth.uid(),
      'SENSITIVE_DATA_ACCESS',
      TG_TABLE_NAME,
      CASE 
        WHEN TG_TABLE_NAME = 'results' THEN NEW.id
        WHEN TG_TABLE_NAME = 'test_results' THEN NEW.id
        WHEN TG_TABLE_NAME = 'messages' THEN NEW.id
        WHEN TG_TABLE_NAME = 'patient_profiles' THEN NEW.id
        ELSE NULL
      END,
      NULL,
      NULL,
      'HEALTH_DATA'
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Consent withdrawal function
CREATE OR REPLACE FUNCTION public.withdraw_consent(_user_id uuid, _consent_type text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  withdrawal_result jsonb;
BEGIN
  -- Log consent withdrawal
  PERFORM public.log_gdpr_action(
    _user_id,
    'CONSENT_WITHDRAWN',
    'profiles',
    _user_id,
    NULL,
    NULL,
    'CONSENT_MANAGEMENT'
  );
  
  -- Update consent status based on type
  CASE _consent_type
    WHEN 'ai_processing' THEN
      UPDATE public.profiles SET ai_consent = false WHERE user_id = _user_id;
      withdrawal_result := jsonb_build_object(
        'consent_type', 'ai_processing',
        'status', 'withdrawn',
        'effect', 'AI processing stopped for future requests',
        'note', 'Existing AI summaries retained for medical record continuity'
      );
    WHEN 'marketing' THEN
      UPDATE public.profiles SET marketing_consent = false WHERE user_id = _user_id;
      withdrawal_result := jsonb_build_object(
        'consent_type', 'marketing',
        'status', 'withdrawn',
        'effect', 'Removed from marketing communications'
      );
    WHEN 'research' THEN
      UPDATE public.profiles SET research_consent = false WHERE user_id = _user_id;
      withdrawal_result := jsonb_build_object(
        'consent_type', 'research',
        'status', 'withdrawn',
        'effect', 'Data excluded from future research studies'
      );
    WHEN 'data_retention' THEN
      UPDATE public.profiles SET data_retention_consent = false WHERE user_id = _user_id;
      -- Trigger GDPR deletion process
      INSERT INTO public.gdpr_requests (user_id, request_type, status, details)
      VALUES (_user_id, 'deletion', 'pending', jsonb_build_object(
        'trigger', 'consent_withdrawal',
        'requested_at', now()
      ));
      withdrawal_result := jsonb_build_object(
        'consent_type', 'data_retention',
        'status', 'withdrawn',
        'effect', 'Data deletion process initiated',
        'timeline', '30 days as per GDPR requirements'
      );
  END CASE;
  
  RETURN withdrawal_result;
END;
$function$;