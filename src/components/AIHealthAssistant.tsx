import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Mic, 
  MicOff, 
  Send, 
  AlertTriangle, 
  Clock, 
  Heart,
  Activity,
  MessageSquare,
  Loader2,
  Volume2,
  VolumeX
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  riskLevel?: 'Low' | 'Moderate' | 'High' | 'Unknown';
  recommendations?: string[];
  urgency?: 'Immediate' | 'Soon' | 'Routine' | 'Monitor';
}

interface UserHealthData {
  age?: number;
  gender?: string;
  conditions?: string[];
  medications?: string[];
  symptoms?: string[];
  vitalSigns?: any;
}

export function AIHealthAssistant() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userHealthData, setUserHealthData] = useState<UserHealthData>({});
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechSynthesis = window.speechSynthesis;

  useEffect(() => {
    // Load user health data from previous entries
    loadUserHealthData();
  }, [user]);

  const loadUserHealthData = async () => {
    // This would typically load from your database
    // For now, we'll use placeholder data
    setUserHealthData({
      age: 35,
      gender: 'Female',
      conditions: ['Hypertension'],
      medications: ['Lisinopril 10mg'],
      symptoms: [],
      vitalSigns: {
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: '98.6°F'
      }
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak your health question or concern",
      });
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice input",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioInput = async (audioBlob: Blob) => {
    try {
      setIsLoading(true);
      
      // Convert audio to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        // Send to voice-to-text edge function
        const response = await fetch('/functions/v1/voice-to-text', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ audio: base64Audio }),
        });

        if (!response.ok) {
          throw new Error('Failed to process audio');
        }

        const result = await response.json();
        
        if (result.text) {
          setInputText(result.text);
          
          // If it's health-related, automatically send to AI
          if (result.isHealthRelated) {
            await sendMessage(result.text);
          }
          
          toast({
            title: "Voice processed",
            description: `Transcribed: "${result.text.substring(0, 50)}..."`,
          });
        }
      };
    } catch (error) {
      toast({
        title: "Voice processing failed",
        description: "Please try again or type your message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (messageText = inputText) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/functions/v1/ai-health-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: messageText,
          userHealth: userHealthData,
          conversationHistory: messages.slice(-6).map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const result = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        timestamp: result.timestamp,
        riskLevel: result.riskLevel,
        recommendations: result.recommendations,
        urgency: result.urgency,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Speak the response if text-to-speech is enabled
      speakResponse(result.response);

    } catch (error) {
      toast({
        title: "AI Assistant Error",
        description: "Unable to process your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const speakResponse = (text: string) => {
    if (speechSynthesis && !isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'High': return 'bg-red-500';
      case 'Moderate': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getUrgencyIcon = (urgency?: string) => {
    switch (urgency) {
      case 'Immediate': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'Soon': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Routine': return <Heart className="h-4 w-4 text-green-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            AI Health Assistant
          </CardTitle>
          <CardDescription>
            Get intelligent health insights and personalized recommendations powered by advanced AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Health Context Summary */}
          {userHealthData.conditions && userHealthData.conditions.length > 0 && (
            <Alert>
              <Heart className="h-4 w-4" />
              <AlertDescription>
                <strong>Your Health Profile:</strong> {userHealthData.age} years old, {userHealthData.gender}
                {userHealthData.conditions.length > 0 && (
                  <span> • Conditions: {userHealthData.conditions.join(', ')}</span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Conversation Area */}
          <div className="min-h-[400px] max-h-[600px] overflow-y-auto space-y-4 p-4 border rounded-lg bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Ask me anything about your health!</p>
                <p className="text-sm">Examples: "I have a headache and fever" or "Explain my blood test results"</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    
                    {message.role === 'assistant' && (
                      <div className="mt-3 space-y-2">
                        {message.riskLevel && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${getRiskColor(message.riskLevel)}`} />
                              Risk: {message.riskLevel}
                            </Badge>
                            {message.urgency && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                {getUrgencyIcon(message.urgency)}
                                {message.urgency}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        {message.recommendations && message.recommendations.length > 0 && (
                          <div className="text-sm">
                            <strong>Key Recommendations:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {message.recommendations.slice(0, 3).map((rec, idx) => (
                                <li key={idx}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border shadow-sm p-3 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2 text-sm">AI is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Ask about symptoms, medications, test results..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                disabled={isLoading}
                className="pr-12"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => setInputText('')}
                disabled={!inputText}
              >
                ×
              </Button>
            </div>
            
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={isSpeaking ? stopSpeaking : () => {}}
              disabled={!isSpeaking}
            >
              {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            
            <Button 
              onClick={() => sendMessage()}
              disabled={isLoading || !inputText.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            💡 This AI assistant provides health insights but doesn't replace professional medical advice.
            For emergencies, call 911 or your local emergency services.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}