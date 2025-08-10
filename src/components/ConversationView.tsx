import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  related_result_id?: string;
  related_result?: { id: string; parsed_data: any };
}

interface Conversation {
  other_user_id: string;
  other_user_name?: string;
  messages: Message[];
  last_message_at: string;
  unread_count: number;
}

interface ConversationViewProps {
  conversation: Conversation;
  currentUserId?: string;
  onSendMessage: (content: string, relatedResultId?: string) => Promise<void>;
  onMarkAsRead: (messageId: string) => Promise<void>;
}

export function ConversationView({
  conversation,
  currentUserId,
  onSendMessage,
  onMarkAsRead,
}: ConversationViewProps) {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await onSendMessage(newMessage.trim());
      setNewMessage('');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Mark unread messages as read when viewing
  useEffect(() => {
    const unreadMessages = conversation.messages.filter(
      (msg) => msg.recipient_id === currentUserId && !msg.read_at
    );

    unreadMessages.forEach((msg) => {
      onMarkAsRead(msg.id);
    });
  }, [conversation.messages, currentUserId, onMarkAsRead]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [conversation.messages]);

  return (
    <div className="flex flex-col h-[600px]">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {conversation.messages.map((message) => {
            const isFromCurrentUser = message.sender_id === currentUserId;
            
            return (
              <div
                key={message.id}
                className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] ${
                    isFromCurrentUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  } rounded-lg p-3`}
                >
                  <p className="text-sm">{message.content}</p>
                  
                  {message.related_result_id && (
                    <div className="mt-2 p-2 bg-black/10 rounded border">
                      <div className="flex items-center gap-2 text-xs">
                        <FileText className="h-3 w-3" />
                        <span>Related to test result</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2 gap-2">
                    <span className="text-xs opacity-70">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </span>
                    {isFromCurrentUser && (
                      <span className="text-xs opacity-70">
                        {message.read_at ? 'Read' : 'Sent'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift+Enter for new line)"
            className="flex-1 min-h-[60px] max-h-[120px]"
            disabled={sending}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            size="sm"
            className="self-end"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground">
          Press Enter to send, Shift+Enter for new line. Max 2000 characters.
        </div>
      </div>
    </div>
  );
}