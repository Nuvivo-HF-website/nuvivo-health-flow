import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Eye, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuthContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface FlaggedResult {
  id: string;
  user_id: string;
  ai_flags: any; // Will be cast to proper type after fetch
  ai_risk_score: number;
  created_at: string;
  ai_generated_at: string;
  parsed_data: any;
}

export const FlaggedResultsDashboard: React.FC = () => {
  const [flaggedResults, setFlaggedResults] = useState<FlaggedResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyFlagged, setShowOnlyFlagged] = useState(true);
  const { user, hasRole } = useAuth();

  const isStaff = hasRole('admin') || hasRole('doctor');

  useEffect(() => {
    if (!isStaff) return;
    loadFlaggedResults();
  }, [isStaff, showOnlyFlagged]);

  const loadFlaggedResults = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('results')
        .select('id, user_id, ai_flags, ai_risk_score, created_at, ai_generated_at, parsed_data')
        .not('ai_flags', 'is', null)
        .order('ai_risk_score', { ascending: false });

      if (showOnlyFlagged) {
        query = query.gte('ai_risk_score', 2); // medium and high only
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading flagged results:', error);
        toast.error('Failed to load flagged results');
        return;
      }

      setFlaggedResults((data as FlaggedResult[]) || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load flagged results');
    } finally {
      setLoading(false);
    }
  };

  const logResultView = async (resultId: string) => {
    try {
      const { error } = await supabase
        .from('ai_review_logs')
        .insert({
          result_id: resultId,
          viewed_by: user?.id,
        });

      if (error) {
        console.error('Failed to log result view:', error);
      }
    } catch (error) {
      console.error('Error logging result view:', error);
    }
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    if (riskLevel === 'high') {
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
    return null;
  };

  if (!isStaff) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Access denied. Staff only.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Flagged Results Dashboard
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <Label htmlFor="show-flagged" className="text-sm">Only flagged (medium/high)</Label>
              <Switch
                id="show-flagged"
                checked={showOnlyFlagged}
                onCheckedChange={setShowOnlyFlagged}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading flagged results...</p>
            </div>
          ) : flaggedResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {showOnlyFlagged ? 'No flagged results found' : 'No results with risk assessment found'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {flaggedResults.map((result) => (
                <Card key={result.id} className="border-l-4 border-l-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          {getRiskIcon(result.ai_flags.riskLevel)}
                          <Badge variant={getRiskBadgeVariant(result.ai_flags.riskLevel)}>
                            {result.ai_flags.riskLevel.toUpperCase()} RISK
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Score: {result.ai_risk_score}
                          </span>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Flagged Tests:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.ai_flags.flaggedTests.map((test, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {test}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {result.ai_flags.reasoning && (
                          <div>
                            <p className="text-sm font-medium">Clinical Reasoning:</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {result.ai_flags.reasoning}
                            </p>
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground">
                          Result created: {new Date(result.created_at).toLocaleDateString()}
                          {result.ai_generated_at && (
                            <span className="ml-3">
                              Risk assessed: {new Date(result.ai_generated_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          onClick={() => logResultView(result.id)}
                        >
                          <Link to={`/results/${result.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View Result
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};