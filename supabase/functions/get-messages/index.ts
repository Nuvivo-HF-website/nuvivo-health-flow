import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const url = new URL(req.url);
    const conversationWith = url.searchParams.get('conversation_with');

    let query = supabase
      .from('messages_decrypted')
      .select(`
        id,
        sender_id,
        recipient_id,
        related_result_id,
        content,
        created_at,
        read_at,
        sender:profiles!messages_sender_id_fkey(full_name),
        recipient:profiles!messages_recipient_id_fkey(full_name),
        related_result:results(id, parsed_data)
      `)
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (conversationWith) {
      query = query.or(`and(sender_id.eq.${user.id},recipient_id.eq.${conversationWith}),and(sender_id.eq.${conversationWith},recipient_id.eq.${user.id})`);
    }

    const { data: messages, error } = await query;

    if (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Failed to fetch messages');
    }

    // Group messages by conversation (other user)
    const conversations = new Map();
    
    messages?.forEach((message) => {
      const otherUserId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
      
      if (!conversations.has(otherUserId)) {
        conversations.set(otherUserId, {
          other_user_id: otherUserId,
          other_user_name: message.sender_id === user.id ? message.recipient?.full_name : message.sender?.full_name,
          messages: [],
          last_message_at: message.created_at,
          unread_count: 0
        });
      }
      
      const conversation = conversations.get(otherUserId);
      conversation.messages.push(message);
      
      // Count unread messages (messages sent to current user that haven't been read)
      if (message.recipient_id === user.id && !message.read_at) {
        conversation.unread_count++;
      }
    });

    const result = Array.from(conversations.values()).map(conv => ({
      ...conv,
      messages: conv.messages.sort((a: any, b: any) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
    }));

    console.log(`Fetched ${result.length} conversations for user ${user.id}`);

    return new Response(
      JSON.stringify({ conversations: result }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in get-messages function:', error);
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