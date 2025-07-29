-- Fix remaining function search path security warnings

CREATE OR REPLACE FUNCTION public.log_data_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_values)
    VALUES (NEW.user_id, TG_OP, TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (NEW.user_id, TG_OP, TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values)
    VALUES (OLD.user_id, TG_OP, TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_appointment_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.appointment_history (appointment_id, action, new_date, changed_by)
    VALUES (NEW.id, 'created', NEW.appointment_date, NEW.user_id);
    
    -- Create notification for new appointment
    PERFORM public.create_notification(
      NEW.user_id,
      'Appointment Scheduled',
      'Your appointment has been scheduled for ' || to_char(NEW.appointment_date, 'DD/MM/YYYY at HH24:MI'),
      'success',
      'appointments',
      '/my-bookings',
      'View Details'
    );
    
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.appointment_date != NEW.appointment_date THEN
      INSERT INTO public.appointment_history (appointment_id, action, old_date, new_date, changed_by)
      VALUES (NEW.id, 'rescheduled', OLD.appointment_date, NEW.appointment_date, auth.uid());
      
      -- Create notification for rescheduled appointment
      PERFORM public.create_notification(
        NEW.user_id,
        'Appointment Rescheduled',
        'Your appointment has been rescheduled to ' || to_char(NEW.appointment_date, 'DD/MM/YYYY at HH24:MI'),
        'info',
        'appointments',
        '/my-bookings',
        'View Details'
      );
    END IF;
    
    IF OLD.status != NEW.status AND NEW.status = 'cancelled' THEN
      INSERT INTO public.appointment_history (appointment_id, action, reason, changed_by)
      VALUES (NEW.id, 'cancelled', NEW.cancellation_reason, auth.uid());
      
      -- Create notification for cancelled appointment
      PERFORM public.create_notification(
        NEW.user_id,
        'Appointment Cancelled',
        'Your appointment scheduled for ' || to_char(NEW.appointment_date, 'DD/MM/YYYY at HH24:MI') || ' has been cancelled',
        'warning',
        'appointments',
        '/booking',
        'Book New Appointment'
      );
    END IF;
    
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$function$;