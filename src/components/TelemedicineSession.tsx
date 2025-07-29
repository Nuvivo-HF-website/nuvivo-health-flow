import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Phone, MessageSquare, Calendar, Clock, User, Star, AlertCircle, Play, Square } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/EnhancedAuthContext';

interface TelemedicineSession {
  id: string;
  user_id: string;
  appointment_id?: string;
  doctor_id?: string;
  session_type: string;
  session_url?: string;
  room_id?: string;
  status: string;
  scheduled_start: string;
  actual_start?: string;
  actual_end?: string;
  duration_minutes?: number;
  recording_url?: string;
  session_notes?: string;
  technical_issues?: string;
  patient_rating?: number;
  doctor_rating?: number;
  created_at: string;
  updated_at: string;
}

const sessionTypes = [
  { id: 'video', name: 'Video Call', icon: Video, description: 'Face-to-face consultation' },
  { id: 'audio', name: 'Audio Call', icon: Phone, description: 'Voice-only consultation' },
  { id: 'chat', name: 'Text Chat', icon: MessageSquare, description: 'Text-based consultation' },
];

export function TelemedicineSession() {
  const [sessions, setSessions] = useState<TelemedicineSession[]>([]);
  const [activeSession, setActiveSession] = useState<TelemedicineSession | null>(null);
  const [sessionNotes, setSessionNotes] = useState('');
  const [technicalIssues, setTechnicalIssues] = useState('');
  const [patientRating, setPatientRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('telemedicine_sessions')
        .select('*')
        .order('scheduled_start', { ascending: false })
        .limit(20);

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load telemedicine sessions",
        variant: "destructive",
      });
    }
  };

  const startSession = async (sessionId: string) => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from('telemedicine_sessions')
        .update({
          status: 'active',
          actual_start: now,
        })
        .eq('id', sessionId);

      if (error) throw error;

      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        setActiveSession({ ...session, status: 'active', actual_start: now });
      }

      toast({
        title: "Session Started",
        description: "Your telemedicine session has begun",
      });

      // Simulate opening telemedicine platform
      if (session?.session_url) {
        window.open(session.session_url, '_blank');
      } else {
        // Generate a mock session URL for demo
        const mockUrl = `https://telehealth.example.com/room/${session?.room_id || 'demo-room'}`;
        window.open(mockUrl, '_blank');
      }

      fetchSessions();
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Error",
        description: "Failed to start session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const endSession = async (sessionId: string) => {
    if (!activeSession) return;

    setLoading(true);
    try {
      const now = new Date().toISOString();
      const startTime = new Date(activeSession.actual_start || activeSession.scheduled_start);
      const endTime = new Date(now);
      const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

      const { error } = await supabase
        .from('telemedicine_sessions')
        .update({
          status: 'completed',
          actual_end: now,
          duration_minutes: durationMinutes,
          session_notes: sessionNotes || null,
          technical_issues: technicalIssues || null,
          patient_rating: patientRating || null,
        })
        .eq('id', sessionId);

      if (error) throw error;

      setActiveSession(null);
      setSessionNotes('');
      setTechnicalIssues('');
      setPatientRating(0);

      toast({
        title: "Session Completed",
        description: "Your telemedicine session has ended",
      });

      fetchSessions();
    } catch (error) {
      console.error('Error ending session:', error);
      toast({
        title: "Error",
        description: "Failed to end session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSessionTypeIcon = (type: string) => {
    const sessionType = sessionTypes.find(t => t.id === type);
    const Icon = sessionType?.icon || Video;
    return <Icon className="h-4 w-4" />;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'active': return 'destructive';
      case 'completed': return 'secondary';
      case 'cancelled': return 'outline';
      default: return 'default';
    }
  };

  const renderStars = (rating: number, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${onRate ? 'cursor-pointer' : ''}`}
            onClick={() => onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Telemedicine</h2>
          <p className="text-muted-foreground">Virtual consultations and remote healthcare</p>
        </div>
      </div>

      {/* Active Session */}
      {activeSession && (
        <Card className="border-primary">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                Active Session
              </CardTitle>
              <Badge variant="destructive">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {getSessionTypeIcon(activeSession.session_type)}
              <div>
                <div className="font-medium">
                  {sessionTypes.find(t => t.id === activeSession.session_type)?.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  Started: {activeSession.actual_start ? 
                    new Date(activeSession.actual_start).toLocaleTimeString() : 
                    'Just now'
                  }
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Session Notes</label>
                <Textarea
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Add notes about this session..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Technical Issues (if any)</label>
                <Textarea
                  value={technicalIssues}
                  onChange={(e) => setTechnicalIssues(e.target.value)}
                  placeholder="Report any technical problems encountered..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Rate this session</label>
                {renderStars(patientRating, setPatientRating)}
              </div>
            </div>

            <Button 
              onClick={() => endSession(activeSession.id)} 
              disabled={loading}
              variant="destructive"
              className="w-full"
            >
              <Square className="h-4 w-4 mr-2" />
              {loading ? "Ending..." : "End Session"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
          <CardDescription>Your scheduled telemedicine appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.filter(s => s.status === 'scheduled').length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No upcoming telemedicine sessions scheduled.
              </p>
            ) : (
              sessions.filter(s => s.status === 'scheduled').map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {getSessionTypeIcon(session.session_type)}
                    <div>
                      <div className="font-medium">
                        {sessionTypes.find(t => t.id === session.session_type)?.name}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(session.scheduled_start).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(session.status)}>
                      {session.status}
                    </Badge>
                    <Button 
                      onClick={() => startSession(session.id)}
                      disabled={loading || activeSession !== null}
                      size="sm"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Session History */}
      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
          <CardDescription>Previous telemedicine consultations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.filter(s => s.status === 'completed').length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No completed sessions yet.
              </p>
            ) : (
              sessions.filter(s => s.status === 'completed').map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {getSessionTypeIcon(session.session_type)}
                    <div>
                      <div className="font-medium">
                        {sessionTypes.find(t => t.id === session.session_type)?.name}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(session.scheduled_start).toLocaleDateString()}
                        </span>
                        {session.duration_minutes && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.duration_minutes} min
                          </span>
                        )}
                      </div>
                      {session.session_notes && (
                        <div className="text-sm text-muted-foreground mt-1 max-w-md truncate">
                          Notes: {session.session_notes}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {session.patient_rating && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Your rating:</span>
                        {renderStars(session.patient_rating)}
                      </div>
                    )}
                    {session.technical_issues && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Issues Reported
                      </Badge>
                    )}
                    <Badge variant={getStatusBadgeVariant(session.status)}>
                      {session.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}