import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Briefcase, 
  Calendar, 
  TestTube, 
  FileText, 
  DollarSign, 
  HelpCircle, 
  Plus,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Upload,
  Download,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";

export default function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState("profile");

  // Mock data for demonstration
  const mockServices = [
    {
      id: 1,
      name: "General Consultation",
      description: "Standard GP consultation for general health concerns",
      duration: "30 minutes",
      price: "£65",
      type: "Video",
      isActive: true
    },
    {
      id: 2,
      name: "Blood Pressure Check",
      description: "Home visit for blood pressure monitoring",
      duration: "20 minutes", 
      price: "£45",
      type: "Home Visit",
      isActive: true
    }
  ];

  const mockAppointments = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      service: "General Consultation",
      date: "2024-01-15",
      time: "14:00",
      status: "Confirmed",
      type: "Video"
    },
    {
      id: 2,
      patientName: "Michael Brown",
      service: "Blood Pressure Check",
      date: "2024-01-16", 
      time: "10:30",
      status: "Pending",
      type: "Home Visit"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Partner Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Dr. John Smith</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Profile Active
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£2,340</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">2 pending review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests Ordered</CardTitle>
              <TestTube className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+3 this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Test Orders
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="earnings" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Earnings
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Support
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Manage your professional profile and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input defaultValue="Dr. John Smith" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue="john.smith@example.com" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Mobile Number</Label>
                    <Input defaultValue="+44 7123 456789" />
                  </div>
                  <div className="space-y-2">
                    <Label>GMC Number</Label>
                    <Input defaultValue="GMC123456" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Professional Bio</Label>
                  <Textarea 
                    placeholder="Tell patients about your experience and specialties..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Clinic Address</Label>
                  <Textarea 
                    placeholder="Enter your clinic address or service area..."
                    rows={3}
                  />
                </div>
                <Button>Update Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">My Services</h3>
                <p className="text-sm text-muted-foreground">Manage the services you offer</p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </div>

            <div className="space-y-4">
              {mockServices.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{service.name}</h4>
                          <Badge variant={service.isActive ? "default" : "secondary"}>
                            {service.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline">{service.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span><strong>Duration:</strong> {service.duration}</span>
                          <span><strong>Price:</strong> {service.price}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Upcoming Appointments</h3>
              <div className="space-y-4">
                {mockAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium">{appointment.patientName}</h4>
                            <Badge variant="outline">{appointment.type}</Badge>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(appointment.status)}
                              <span className="text-sm">{appointment.status}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{appointment.service}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span><strong>Date:</strong> {appointment.date}</span>
                            <span><strong>Time:</strong> {appointment.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Test Orders Tab */}
          <TabsContent value="tests" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Test Orders</h3>
                <p className="text-sm text-muted-foreground">Order tests for patients and access results</p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Order Test
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Order New Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Patient Email/Name</Label>
                    <Input placeholder="patient@example.com or John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label>Test Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select test type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic Health Panel</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive Health</SelectItem>
                        <SelectItem value="hormones">Hormone Panel</SelectItem>
                        <SelectItem value="vitamins">Vitamin Deficiency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Clinical Notes</Label>
                  <Textarea placeholder="Add any relevant clinical information..." />
                </div>
                <Button>Order Test</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Documents & Certifications</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upload Documents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Indemnity Insurance</span>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">DBS/PVG Check</span>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Professional Certificates</span>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Download Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Referral Template</span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Onboarding Guide</span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Nuvivo Branding Kit</span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Earnings Overview</h3>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">£2,340</div>
                    <p className="text-sm text-muted-foreground">15 completed appointments</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Last Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">£1,950</div>
                    <p className="text-sm text-muted-foreground">12 completed appointments</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Next Payout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">£875</div>
                    <p className="text-sm text-muted-foreground">15th January 2024</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">General Consultation</p>
                          <p className="text-sm text-muted-foreground">Sarah Johnson - 12/01/2024</p>
                        </div>
                        <Badge variant="default">£65</Badge>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice Summary
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Support & Help</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Submit Support Ticket</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input placeholder="Brief description of your issue" />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="payment">Payment Question</SelectItem>
                          <SelectItem value="booking">Booking Problem</SelectItem>
                          <SelectItem value="account">Account Issue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Textarea placeholder="Describe your issue in detail..." rows={4} />
                    </div>
                    <Button>Submit Ticket</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Help</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        View FAQ
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact Support WhatsApp
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="mr-2 h-4 w-4" />
                        Download User Guide
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="text-sm text-muted-foreground">
                      <p><strong>Support Hours:</strong></p>
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Weekend: Emergency support only</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}