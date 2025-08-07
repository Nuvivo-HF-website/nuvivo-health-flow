import { supabase } from '@/integrations/supabase/client';

export const createAdminUser = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('create-admin-user', {
      method: 'POST'
    });

    if (error) {
      console.error('Error calling create-admin-user function:', error);
      return { success: false, error: error.message };
    }

    console.log('Admin user creation result:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
};

// Call this function immediately
createAdminUser().then(result => {
  console.log('Admin user creation completed:', result);
});