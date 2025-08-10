import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  user_id: string;
  full_name: string;
  user_type: string;
}

interface MessageComposerProps {
  onSend: (recipientId: string, content: string, relatedResultId?: string) => Promise<void>;
  onCancel: () => void;
  preselectedRecipient?: string;
  relatedResultId?: string;
}

export function MessageComposer({
  onSend,
  onCancel,
  preselectedRecipient,
  relatedResultId,
}: MessageComposerProps) {
  const [content, setContent] = useState('');
  const [recipientId, setRecipientId] = useState(preselectedRecipient || '');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAvailableUsers();
  }, []);

  const fetchAvailableUsers = async () => {
    try {
      // Fetch healthcare providers (doctors, admins)
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('user_id, full_name, user_type')
        .in('user_type', ['doctor', 'admin'])
        .order('full_name');

      if (error) {
        throw error;
      }

      setAvailableUsers(profiles || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load available recipients',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!recipientId || !content.trim() || sending) return;

    if (content.length > 2000) {
      toast({
        title: 'Error',
        description: 'Message is too long (max 2000 characters)',
        variant: 'destructive',
      });
      return;
    }

    setSending(true);
    try {
      await onSend(recipientId, content.trim(), relatedResultId);
      setContent('');
      onCancel();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">To:</label>
        <Select value={recipientId} onValueChange={setRecipientId} disabled={!!preselectedRecipient}>
          <SelectTrigger>
            <SelectValue placeholder="Select a healthcare provider" />
          </SelectTrigger>
          <SelectContent>
            {availableUsers.map((user) => (
              <SelectItem key={user.user_id} value={user.user_id}>
                {user.full_name} ({user.user_type})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {relatedResultId && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            This message will be linked to a test result for context.
          </p>
        </div>
      )}

      <div>
        <label className="text-sm font-medium mb-2 block">Message:</label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here... (Shift+Enter for new line)"
          className="min-h-[120px]"
          disabled={sending}
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {content.length}/2000 characters
          </span>
          <span className="text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={sending}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={handleSend}
          disabled={!recipientId || !content.trim() || sending}
        >
          {sending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Send Message
        </Button>
      </div>

      <div className="p-4 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Important:</strong> This messaging system is for non-urgent communication only. 
          For medical emergencies, please call emergency services or contact your healthcare provider directly.
        </p>
      </div>
    </div>
  );
}