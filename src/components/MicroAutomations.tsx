import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Zap, 
  Calendar, 
  Bell, 
  MessageSquare, 
  HeartHandshake, 
  Brain,
  Activity,
  Clock,
  Smartphone,
  Mail,
  Shield,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Settings,
  Plus,
  Play,
  Pause,
  MoreHorizontal
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface Automation {
  id: string
  name: string
  description: string
  category: 'health-monitoring' | 'medication' | 'appointments' | 'communication' | 'emergency'
  trigger: {
    type: 'time' | 'data' | 'event' | 'manual'
    condition: string
    value?: string | number
  }
  actions: {
    type: 'notification' | 'reminder' | 'alert' | 'report' | 'booking'
    target: string
    message?: string
  }[]
  isActive: boolean
  frequency: string
  lastTriggered?: string
  successRate: number
  createdAt: string
}

interface AutomationTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: any
  complexity: 'simple' | 'moderate' | 'advanced'
  trigger: any
  actions: any[]
  benefits: string[]
}

export default function MicroAutomations() {
  const [automations, setAutomations] = useState<Automation[]>([])
  const [templates, setTemplates] = useState<AutomationTemplate[]>([])
  const [activeTab, setActiveTab] = useState('active')
  const [newAutomationOpen, setNewAutomationOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load automations and templates
    setTimeout(() => {
      setAutomations(mockAutomations)
      setTemplates(automationTemplates)
      setIsLoading(false)
    }, 1000)
  }, [])

  const mockAutomations: Automation[] = [
    {
      id: '1',
      name: 'Daily Medication Reminder',
      description: 'Reminds to take morning medications and vitamins',
      category: 'medication',
      trigger: {
        type: 'time',
        condition: 'daily_at',
        value: '08:00'
      },
      actions: [
        {
          type: 'notification',
          target: 'mobile',
          message: 'Time to take your morning medications'
        },
        {
          type: 'reminder',
          target: 'email',
          message: 'Medication adherence tracking'
        }
      ],
      isActive: true,
      frequency: 'Daily',
      lastTriggered: new Date().toISOString(),
      successRate: 94,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      name: 'Blood Pressure Alert',
      description: 'Alerts when blood pressure readings exceed normal range',
      category: 'health-monitoring',
      trigger: {
        type: 'data',
        condition: 'bp_systolic_above',
        value: 140
      },
      actions: [
        {
          type: 'alert',
          target: 'emergency_contact',
          message: 'Blood pressure reading requires attention'
        },
        {
          type: 'booking',
          target: 'doctor',
          message: 'Schedule urgent consultation'
        }
      ],
      isActive: true,
      frequency: 'Event-driven',
      lastTriggered: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      successRate: 100,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      name: 'Weekly Health Report',
      description: 'Compiles and sends weekly health summary to care team',
      category: 'communication',
      trigger: {
        type: 'time',
        condition: 'weekly_on',
        value: 'sunday'
      },
      actions: [
        {
          type: 'report',
          target: 'care_team',
          message: 'Weekly health metrics and progress report'
        }
      ],
      isActive: true,
      frequency: 'Weekly',
      lastTriggered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      successRate: 96,
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      name: 'Appointment Follow-up',
      description: 'Automatically schedules follow-up appointments after consultations',
      category: 'appointments',
      trigger: {
        type: 'event',
        condition: 'appointment_completed',
        value: 'consultation'
      },
      actions: [
        {
          type: 'notification',
          target: 'patient',
          message: 'Schedule your follow-up appointment'
        },
        {
          type: 'booking',
          target: 'scheduler',
          message: 'Auto-suggest follow-up slots'
        }
      ],
      isActive: false,
      frequency: 'Event-driven',
      successRate: 87,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]

  const automationTemplates: AutomationTemplate[] = [
    {
      id: '1',
      name: 'Medication Adherence Tracker',
      description: 'Smart reminders with missed dose alerts and refill notifications',
      category: 'medication',
      icon: HeartHandshake,
      complexity: 'simple',
      trigger: { type: 'time', condition: 'scheduled_time' },
      actions: [
        { type: 'notification', target: 'patient' },
        { type: 'reminder', target: 'caregiver_if_missed' }
      ],
      benefits: [
        'Improves medication compliance by 40%',
        'Reduces missed doses',
        'Automatic refill reminders'
      ]
    },
    {
      id: '2',
      name: 'Vital Signs Monitor',
      description: 'Continuous monitoring with intelligent alerting for abnormal readings',
      category: 'health-monitoring',
      icon: Activity,
      complexity: 'moderate',
      trigger: { type: 'data', condition: 'threshold_exceeded' },
      actions: [
        { type: 'alert', target: 'healthcare_provider' },
        { type: 'notification', target: 'patient' },
        { type: 'booking', target: 'urgent_care' }
      ],
      benefits: [
        'Early detection of health issues',
        'Automatic provider notification',
        'Reduces emergency situations'
      ]
    },
    {
      id: '3',
      name: 'Preventive Care Scheduler',
      description: 'Automatically schedules routine checkups and screenings based on guidelines',
      category: 'appointments',
      icon: Calendar,
      complexity: 'advanced',
      trigger: { type: 'time', condition: 'due_for_screening' },
      actions: [
        { type: 'booking', target: 'preventive_care' },
        { type: 'notification', target: 'patient' }
      ],
      benefits: [
        'Never miss important screenings',
        'Personalized scheduling based on age/risk',
        'Improves preventive care compliance'
      ]
    },
    {
      id: '4',
      name: 'Care Team Communication Hub',
      description: 'Coordinates communication between all members of your care team',
      category: 'communication',
      icon: MessageSquare,
      complexity: 'moderate',
      trigger: { type: 'event', condition: 'significant_change' },
      actions: [
        { type: 'notification', target: 'all_providers' },
        { type: 'report', target: 'care_coordinator' }
      ],
      benefits: [
        'Improved care coordination',
        'Real-time provider updates',
        'Reduced communication gaps'
      ]
    },
    {
      id: '5',
      name: 'Emergency Response System',
      description: 'Intelligent emergency detection and automated response protocols',
      category: 'emergency',
      icon: AlertTriangle,
      complexity: 'advanced',
      trigger: { type: 'data', condition: 'emergency_detected' },
      actions: [
        { type: 'alert', target: 'emergency_services' },
        { type: 'notification', target: 'emergency_contacts' },
        { type: 'alert', target: 'primary_physician' }
      ],
      benefits: [
        'Faster emergency response',
        'Automatic contact notification',
        'Critical health data sharing'
      ]
    },
    {
      id: '6',
      name: 'Wellness Goal Tracker',
      description: 'Motivational automation for fitness and wellness goal achievement',
      category: 'health-monitoring',
      icon: Target,
      complexity: 'simple',
      trigger: { type: 'data', condition: 'goal_progress' },
      actions: [
        { type: 'notification', target: 'patient' },
        { type: 'report', target: 'wellness_coach' }
      ],
      benefits: [
        'Increased motivation',
        'Progress tracking',
        'Personalized encouragement'
      ]
    }
  ]

  const toggleAutomation = async (automationId: string) => {
    setAutomations(prev => prev.map(automation => 
      automation.id === automationId 
        ? { ...automation, isActive: !automation.isActive }
        : automation
    ))
    
    toast({
      title: "Automation Updated",
      description: "Automation status has been changed successfully."
    })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication': return HeartHandshake
      case 'health-monitoring': return Activity
      case 'appointments': return Calendar
      case 'communication': return MessageSquare
      case 'emergency': return AlertTriangle
      default: return Zap
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medication': return 'bg-blue-50 text-blue-700'
      case 'health-monitoring': return 'bg-green-50 text-green-700'
      case 'appointments': return 'bg-purple-50 text-purple-700'
      case 'communication': return 'bg-orange-50 text-orange-700'
      case 'emergency': return 'bg-red-50 text-red-700'
      default: return 'bg-gray-50 text-gray-700'
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'text-green-600'
      case 'moderate': return 'text-yellow-600'
      case 'advanced': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading automation systems...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Micro Automations
          </CardTitle>
          <CardDescription>
            Intelligent automation workflows to streamline your healthcare management and improve outcomes
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Automations</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Active</p>
                    <p className="text-2xl font-bold">{automations.filter(a => a.isActive).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Success Rate</p>
                    <p className="text-2xl font-bold">
                      {Math.round(automations.reduce((acc, a) => acc + a.successRate, 0) / automations.length)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Time Saved</p>
                    <p className="text-2xl font-bold">2.5h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Health Score</p>
                    <p className="text-2xl font-bold">+12%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Automations List */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Your Automations</CardTitle>
                <Dialog open={newAutomationOpen} onOpenChange={setNewAutomationOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Automation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Automation</DialogTitle>
                      <DialogDescription>
                        Set up a custom automation workflow for your healthcare needs
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="automation-name">Automation Name</Label>
                        <Input id="automation-name" placeholder="e.g., Morning Medication Reminder" />
                      </div>
                      <div>
                        <Label htmlFor="automation-category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="medication">Medication</SelectItem>
                            <SelectItem value="health-monitoring">Health Monitoring</SelectItem>
                            <SelectItem value="appointments">Appointments</SelectItem>
                            <SelectItem value="communication">Communication</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1">Create Automation</Button>
                        <Button variant="outline" onClick={() => setNewAutomationOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automations.map((automation) => {
                  const IconComponent = getCategoryIcon(automation.category)
                  return (
                    <Card key={automation.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{automation.name}</h3>
                              <Badge className={getCategoryColor(automation.category)}>
                                {automation.category.replace('-', ' ')}
                              </Badge>
                              {automation.isActive && (
                                <Badge variant="outline" className="text-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Active
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{automation.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Frequency: {automation.frequency}</span>
                              <span>Success Rate: {automation.successRate}%</span>
                              {automation.lastTriggered && (
                                <span>Last Run: {new Date(automation.lastTriggered).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={automation.isActive}
                            onCheckedChange={() => toggleAutomation(automation.id)}
                          />
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automation Templates</CardTitle>
              <CardDescription>
                Pre-built automation workflows designed by healthcare experts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template) => {
                  const IconComponent = template.icon
                  return (
                    <Card key={template.id} className="p-4">
                      <div className="flex items-start space-x-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{template.name}</h3>
                            <Badge className={getCategoryColor(template.category)}>
                              {template.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                          <Badge className={getComplexityColor(template.complexity)}>
                            {template.complexity}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Benefits</h4>
                        <ul className="space-y-1">
                          {template.benefits.map((benefit, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Automation Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automations.map((automation) => (
                    <div key={automation.id} className="flex justify-between items-center">
                      <span className="text-sm">{automation.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${automation.successRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{automation.successRate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Medication Adherence</span>
                    <span className="text-green-600 font-bold">+23%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Appointment Attendance</span>
                    <span className="text-blue-600 font-bold">+18%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium">Health Monitoring</span>
                    <span className="text-purple-600 font-bold">+34%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium">Care Coordination</span>
                    <span className="text-orange-600 font-bold">+27%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}