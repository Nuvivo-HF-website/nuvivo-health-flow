import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/EnhancedAuthContext';

interface SummaryButtonProps {
  resultId: string;
  hasExistingSummary?: boolean;
  userHasConsent?: boolean;
  onSummaryGenerated?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
}

export function SummaryButton({ 
  resultId, 
  hasExistingSummary = false,
  userHasConsent = false,
  onSummaryGenerated,
  disabled = false,
  size = 'sm',
  variant = 'outline'
}: SummaryButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { hasRole } = useAuth();

  const isStaff = hasRole('admin') || hasRole('doctor');

  const generateSummary = async () => {
    if (!userHasConsent) {
      toast({
        title: "AI Consent Required",
        description: "The patient must enable AI insights in their profile before summaries can be generated.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-summary', {
        body: { resultId }
      });

      if (error) {
        console.error('Error generating summary:', error);
        throw new Error(error.message || 'Failed to generate summary');
      }

      toast({
        title: "AI Summary Generated",
        description: "The AI summary has been generated successfully.",
      });

      // Call the callback to refresh the parent component
      if (onSummaryGenerated) {
        onSummaryGenerated();
      }

    } catch (error) {
      console.error('Error generating AI summary:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate AI summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Don't show button to non-staff users
  if (!isStaff) {
    return null;
  }

  const isDisabled = disabled || isGenerating || (!userHasConsent && !hasExistingSummary);

  return (
    <Button
      onClick={generateSummary}
      disabled={isDisabled}
      size={size}
      variant={variant}
      className="flex items-center space-x-2"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Generating...</span>
        </>
      ) : hasExistingSummary ? (
        <>
          <Brain className="h-4 w-4" />
          <span>Regenerate Summary</span>
        </>
      ) : !userHasConsent ? (
        <>
          <AlertCircle className="h-4 w-4" />
          <span>No AI Consent</span>
        </>
      ) : (
        <>
          <Brain className="h-4 w-4" />
          <span>Generate AI Summary</span>
        </>
      )}
    </Button>
  );
}