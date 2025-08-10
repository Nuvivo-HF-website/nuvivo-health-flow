import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, ChevronLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { useToast } from '@/hooks/use-toast';
import { MessageComposer } from './MessageComposer';
import { ConversationView } from './ConversationView';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  related_result_id?: string;
  sender?: { full_name?: string };
  recipient?: { full_name?: string };
  related_result?: { id: string; parsed_data: any };
}

interface Conversation {
  other_user_id: string;
  other_user_name?: string;
  messages: Message[];
  last_message_at: string;
  unread_count: number;
}

export function MessagingInbox() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);
  const { user, session } = useAuth();
  const { toast } = useToast();

  const fetchConversations = async () => {
    if (!session?.access_token) return;

    try {
      const response = await supabase.functions.invoke('get-messages', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw response.error;
      }

      setConversations(response.data.conversations || []);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (recipientId: string, content: string, relatedResultId?: string) => {
    if (!session?.access_token) return;

    try {
      const response = await supabase.functions.invoke('send-message', {
        body: {
          recipient_id: recipientId,
          content,
          related_result_id: relatedResultId,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw response.error;
      }

      toast({
        title: 'Success',
        description: 'Message sent successfully',
      });

      // Refresh conversations
      await fetchConversations();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!session?.access_token) return;

    try {
      await supabase.functions.invoke('mark-message-read', {
        body: { message_id: messageId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
    } catch (error: any) {
      console.error('Error marking message as read:', error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [session]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (selectedConversation) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedConversation(null)}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <CardTitle>
              Conversation with {selectedConversation.other_user_name || 'Unknown User'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ConversationView
            conversation={selectedConversation}
            currentUserId={user?.id}
            onSendMessage={(content, relatedResultId) =>
              sendMessage(selectedConversation.other_user_id, content, relatedResultId)
            }
            onMarkAsRead={markAsRead}
          />
        </CardContent>
      </Card>
    );
  }

  if (showComposer) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComposer(false)}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <CardTitle>New Message</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <MessageComposer
            onSend={sendMessage}
            onCancel={() => setShowComposer(false)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Messages
            </CardTitle>
            <CardDescription>
              Secure messaging with your healthcare team
            </CardDescription>
          </div>
          <Button onClick={() => setShowComposer(true)} size="sm">
            <Send className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {conversations.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
            <p className="text-muted-foreground mb-4">
              Start a conversation with your healthcare team
            </p>
            <Button onClick={() => setShowComposer(true)}>
              <Send className="h-4 w-4 mr-2" />
              Send First Message
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {conversations.map((conversation) => {
                const lastMessage = conversation.messages[conversation.messages.length - 1];
                return (
                  <Card
                    key={conversation.other_user_id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">
                              {conversation.other_user_name || 'Unknown User'}
                            </h4>
                            {conversation.unread_count > 0 && (
                              <Badge variant="default" className="text-xs">
                                {conversation.unread_count}
                              </Badge>
                            )}
                          </div>
                          {lastMessage && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {lastMessage.content}
                            </p>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {lastMessage && new Date(lastMessage.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        )}
        
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Privacy Notice:</strong> Messages are encrypted and only accessible to you and your assigned healthcare providers. 
            This platform is for informational purposes only and not for medical emergencies.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}