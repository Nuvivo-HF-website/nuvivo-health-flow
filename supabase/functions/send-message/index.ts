import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendMessageRequest {
  recipient_id: string;
  content: string;
  related_result_id?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the user from the request
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authorization');
    }

    const { recipient_id, content, related_result_id }: SendMessageRequest = await req.json();

    if (!recipient_id || !content) {
      throw new Error('Missing required fields: recipient_id and content');
    }

    // Validate content length
    if (content.length > 2000) {
      throw new Error('Message content too long (max 2000 characters)');
    }

    // Check if sender is authorized to message the recipient
    // For now, we'll allow all authenticated users to message each other
    // In production, you'd implement role-based restrictions here

    // Encode the message content
    const { data: encodedContent, error: encodeError } = await supabase
      .rpc('encode_message_content', { content_text: content });

    if (encodeError) {
      console.error('Error encoding message:', encodeError);
      throw new Error('Failed to encode message');
    }

    // Insert the message
    const { data: message, error: insertError } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        recipient_id,
        content: encodedContent,
        related_result_id: related_result_id || null
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting message:', insertError);
      throw new Error('Failed to send message');
    }

    console.log('Message sent successfully:', message.id);

    return new Response(
      JSON.stringify({ success: true, message_id: message.id }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in send-message function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);