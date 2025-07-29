import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Video, 
  Camera, 
  Mic, 
  MicOff,
  VideoOff,
  Phone,
  PhoneOff,
  Users,
  Share,
  Circle as Record,
  MessageSquare,
  FileText,
  Brain,
  Stethoscope,
  Activity,
  Heart,
  Clock,
  CheckCircle,
  Calendar,
  User,
  Settings,
  Monitor
} from 'lucide-react';

interface TelemedicineSession {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  scheduledTime: Date;
  actualStartTime?: Date;
  endTime?: Date;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  sessionType: 'video' | 'audio' | 'chat';
  roomId: string;
  meetingLink: string;
  notes?: string;
  prescription?: string;
  followUpRequired: boolean;
  recordingEnabled: boolean;
  sharedVitals?: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSat: number;
  };
  aiInsights?: string[];
}

interface SessionParticipant {
  id: string;
  name: string;
  role: 'patient' | 'doctor' | 'specialist' | 'nurse';
  isOnline: boolean;
  cameraOn: boolean;
  micOn: boolean;
}

export function EnhancedTelemedicine() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<TelemedicineSession[]>([]);
  const [activeSession, setActiveSession] = useState<TelemedicineSession | null>(null);
  const [participants, setParticipants] = useState<SessionParticipant[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [sharedVitals, setSharedVitals] = useState(false);

  useEffect(() => {
    loadTelemedicineSessions();
    // Simulate real-time updates
    const interval = setInterval(updateSessionStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadTelemedicineSessions = () => {
    // Mock sessions data
    const mockSessions: TelemedicineSession[] = [
      {
        id: '1',
        patientId: user?.id || 'patient-1',
        doctorId: 'doctor-1',
        doctorName: 'Dr. Sarah Wilson',
        doctorSpecialty: 'Cardiology',
        scheduledTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        status: 'scheduled',
        sessionType: 'video',
        roomId: 'room-12345',
        meetingLink: 'https://meet.healthcare.com/room-12345',
        followUpRequired: false,
        recordingEnabled: true,
        aiInsights: [
          'Patient shows signs of mild anxiety',
          'Blood pressure readings are within normal range',
          'Recommend lifestyle modifications'
        ]
      },
      {
        id: '2',
        patientId: user?.id || 'patient-1',
        doctorId: 'doctor-2',
        doctorName: 'Dr. Michael Chen',
        doctorSpecialty: 'General Practice',
        scheduledTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        actualStartTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
        status: 'completed',
        sessionType: 'video',
        roomId: 'room-67890',
        meetingLink: 'https://meet.healthcare.com/room-67890',
        followUpRequired: true,
        recordingEnabled: true,
        notes: 'Patient reported mild fatigue. Recommended blood work and follow-up in 2 weeks.',
        prescription: 'Vitamin D3 1000 IU daily, Blood work panel'
      }
    ];

    setSessions(mockSessions);
  };

  const updateSessionStatus = () => {
    // Simulate real-time session updates
    setSessions(prev => prev.map(session => {
      if (session.status === 'scheduled' && session.scheduledTime <= new Date()) {
        return { ...session, status: 'active' as const };
      }
      return session;
    }));
  };

  const startSession = async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    setActiveSession(session);
    setIsCallActive(true);
    
    // Mock participants
    setParticipants([
      {
        id: 'patient-1',
        name: 'You',
        role: 'patient',
        isOnline: true,
        cameraOn: true,
        micOn: true
      },
      {
        id: session.doctorId,
        name: session.doctorName,
        role: 'doctor',
        isOnline: true,
        cameraOn: true,
        micOn: true
      }
    ]);

    // Update session status
    setSessions(prev => prev.map(s => 
      s.id === sessionId 
        ? { ...s, status: 'active', actualStartTime: new Date() }
        : s
    ));

    // Simulate AI insights during session
    setTimeout(() => {
      setAiSuggestions([
        'Patient appears calm and engaged',
        'Consider discussing preventive care measures',
        'Blood pressure readings from wearable look normal'
      ]);
    }, 10000);

    toast({
      title: "Session Started",
      description: `Connected to ${session.doctorName}`,
    });
  };

  const endSession = async () => {
    if (!activeSession) return;

    setIsCallActive(false);
    const endTime = new Date();

    // Update session with end time and notes
    setSessions(prev => prev.map(s => 
      s.id === activeSession.id 
        ? { 
            ...s, 
            status: 'completed',
            endTime,
            notes: sessionNotes || 'Telemedicine consultation completed'
          }
        : s
    ));

    setActiveSession(null);
    setSessionNotes('');
    setAiSuggestions([]);
    setSharedVitals(false);

    toast({
      title: "Session Ended",
      description: "Consultation completed successfully",
    });
  };

  const toggleCamera = () => {
    setCameraOn(!cameraOn);
    // Update participant status
    setParticipants(prev => prev.map(p => 
      p.role === 'patient' ? { ...p, cameraOn: !cameraOn } : p
    ));
  };

  const toggleMic = () => {
    setMicOn(!micOn);
    setParticipants(prev => prev.map(p => 
      p.role === 'patient' ? { ...p, micOn: !micOn } : p
    ));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Recording Stopped" : "Recording Started",
      description: isRecording ? "Session recording has been stopped" : "Session is now being recorded",
    });
  };

  const shareVitals = () => {
    setSharedVitals(true);
    // Mock sharing vital signs
    if (activeSession) {
      const vitals = {
        heartRate: 72,
        bloodPressure: '120/80',
        temperature: 98.6,
        oxygenSat: 98
      };
      
      setActiveSession(prev => prev ? { ...prev, sharedVitals: vitals } : null);
      
      toast({
        title: "Vitals Shared",
        description: "Your current vital signs have been shared with the doctor",
      });
    }
  };

  const scheduleFollowUp = () => {
    toast({
      title: "Follow-up Scheduled",
      description: "A follow-up appointment has been scheduled for next week",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      scheduled: 'secondary',
      active: 'default',
      completed: 'outline',
      cancelled: 'destructive'
    };
    const variant = variants[status] || 'secondary';
    return <Badge variant={variant}>{status}</Badge>;
  };

  if (isCallActive && activeSession) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Video Call Interface */}
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="bg-gray-900 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="font-medium">{activeSession.doctorName}</span>
                <Badge variant="outline" className="text-xs">
                  {activeSession.doctorSpecialty}
                </Badge>
              </div>
              {isRecording && (
                <div className="flex items-center gap-1 text-red-400">
                  <Record className="h-4 w-4 animate-pulse" />
                  <span className="text-sm">Recording</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Main Video Area */}
          <div className="flex-1 relative">
            {/* Doctor's Video (Main) */}
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-center">
                <User className="h-24 w-24 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">{activeSession.doctorName}</p>
                <p className="text-gray-400">{activeSession.doctorSpecialty}</p>
              </div>
            </div>

            {/* Patient's Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg border-2 border-white/20 flex items-center justify-center">
              {cameraOn ? (
                <div className="text-center">
                  <User className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">You</p>
                </div>
              ) : (
                <div className="text-center">
                  <VideoOff className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Camera Off</p>
                </div>
              )}
            </div>

            {/* AI Insights Panel */}
            {aiSuggestions.length > 0 && (
              <div className="absolute top-4 left-4 w-80 bg-gray-900/90 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">AI Clinical Insights</span>
                </div>
                <ul className="space-y-1">
                  {aiSuggestions.map((insight, idx) => (
                    <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                      <span className="w-1 h-1 bg-blue-400 rounded-full mt-2" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Shared Vitals */}
            {sharedVitals && activeSession.sharedVitals && (
              <div className="absolute bottom-20 left-4 bg-gray-900/90 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">Live Vitals</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>HR: {activeSession.sharedVitals.heartRate} BPM</div>
                  <div>BP: {activeSession.sharedVitals.bloodPressure}</div>
                  <div>Temp: {activeSession.sharedVitals.temperature}°F</div>
                  <div>O2: {activeSession.sharedVitals.oxygenSat}%</div>
                </div>
              </div>
            )}
          </div>

          {/* Call Controls */}
          <div className="bg-gray-900 p-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={micOn ? "secondary" : "destructive"}
                size="lg"
                onClick={toggleMic}
                className="rounded-full w-12 h-12 p-0"
              >
                {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              
              <Button
                variant={cameraOn ? "secondary" : "destructive"}
                size="lg"
                onClick={toggleCamera}
                className="rounded-full w-12 h-12 p-0"
              >
                {cameraOn ? <Camera className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>

              <Button
                variant="destructive"
                size="lg"
                onClick={endSession}
                className="rounded-full w-12 h-12 p-0"
              >
                <PhoneOff className="h-5 w-5" />
              </Button>

              <Button
                variant={isRecording ? "destructive" : "secondary"}
                size="lg"
                onClick={toggleRecording}
                className="rounded-full w-12 h-12 p-0"
              >
                <Record className="h-5 w-5" />
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={shareVitals}
                className="rounded-full w-12 h-12 p-0"
                disabled={sharedVitals}
              >
                <Heart className="h-5 w-5" />
              </Button>

              <Button
                variant="secondary"
                size="lg"
                className="rounded-full w-12 h-12 p-0"
              >
                <Share className="h-5 w-5" />
              </Button>
            </div>

            {/* Participants */}
            <div className="flex items-center justify-center gap-4 mt-4">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${participant.isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
                  <span>{participant.name}</span>
                  {!participant.micOn && <MicOff className="h-3 w-3 text-red-400" />}
                  {!participant.cameraOn && <VideoOff className="h-3 w-3 text-red-400" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-6 w-6 text-blue-600" />
            Enhanced Telemedicine Platform
          </CardTitle>
          <CardDescription>
            HD video consultations with AI-powered clinical decision support and real-time health monitoring
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col gap-2">
              <Calendar className="h-6 w-6" />
              Schedule Consultation
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Video className="h-6 w-6" />
              Join Waiting Room
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <MessageSquare className="h-6 w-6" />
              Send Message
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <FileText className="h-6 w-6" />
              View Records
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Upcoming Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.filter(s => s.status === 'scheduled').map((session) => (
            <div key={session.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{session.doctorName}</h3>
                  <p className="text-sm text-muted-foreground">{session.doctorSpecialty}</p>
                </div>
                {getStatusBadge(session.status)}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {session.scheduledTime.toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {session.scheduledTime.toLocaleTimeString()}
                </div>
                <div className="flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  {session.sessionType}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => startSession(session.id)}
                  disabled={session.scheduledTime > new Date()}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Join Session
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Doctor
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Session History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Recent Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.filter(s => s.status === 'completed').map((session) => (
            <div key={session.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{session.doctorName}</h3>
                  <p className="text-sm text-muted-foreground">{session.doctorSpecialty}</p>
                </div>
                {getStatusBadge(session.status)}
              </div>

              {session.notes && (
                <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Session Notes:</h4>
                  <p className="text-sm text-gray-700">{session.notes}</p>
                </div>
              )}

              {session.prescription && (
                <div className="mb-3 p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Prescription:</h4>
                  <p className="text-sm text-gray-700">{session.prescription}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  View Summary
                </Button>
                {session.followUpRequired && (
                  <Button variant="outline" size="sm" onClick={scheduleFollowUp}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Follow-up
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4 mr-2" />
                  View Recording
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}