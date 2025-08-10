import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuthContext';
import { toast } from 'sonner';

interface RiskFlaggingButtonProps {
  resultId: string;
  hasExistingFlags?: boolean;
  onFlagsGenerated?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
}

export const RiskFlaggingButton: React.FC<RiskFlaggingButtonProps> = ({
  resultId,
  hasExistingFlags = false,
  onFlagsGenerated,
  disabled = false,
  size = 'default',
  variant = 'outline'
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { hasRole } = useAuth();
  const isStaff = hasRole('admin') || hasRole('doctor');

  const generateRiskFlags = async () => {
    if (!isStaff) {
      toast.error('Only staff can generate risk flags');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-risk-flags', {
        body: { resultId }
      });

      if (error) {
        console.error('Error generating risk flags:', error);
        toast.error(error.message || 'Failed to generate risk flags');
        return;
      }

      toast.success('Risk flags generated successfully');
      onFlagsGenerated?.();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate risk flags');
    } finally {
      setIsGenerating(false);
    }
  };

  // Only show for staff users
  if (!isStaff) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={generateRiskFlags}
      disabled={disabled || isGenerating}
      className="gap-2"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <AlertTriangle className="h-4 w-4" />
      )}
      {isGenerating 
        ? 'Generating...' 
        : hasExistingFlags 
          ? 'Regenerate Risk Flags' 
          : 'Generate Risk Flags'
      }
    </Button>
  );
};