import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Building,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Plus,
  Settings,
  BarChart3,
  UserPlus,
  Edit,
  Trash2
} from "lucide-react";

export default function ClinicDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock clinic data
  const clinicData = {
    name: "Active Health Clinic",
    address: "123 Health Street, Edinburgh, EH1 2AB",
    teamSize: 8,
    locations: 2,
    monthlyRevenue: "£18,750",
    totalBookings: 142,
    activeServices: 12
  };

  const teamMembers = [
    {
      id: 1,
      name: "Dr. Sarah Wilson",
      role: "GP",
      email: "sarah@activehealthclinic.co.uk",
      bookings: 28,
      revenue: "£2,840",
      status: "active"
    },
    {
      id: 2,
      name: "Nurse Emma Taylor",
      role: "Practice Nurse", 
      email: "emma@activehealthclinic.co.uk",
      bookings: 35,
      revenue: "£1,575",
      status: "active"
    },
    {
      id: 3,
      name: "Dr. James Miller",
      role: "Physiotherapist",
      email: "james@activehealthclinic.co.uk", 
      bookings: 22,
      revenue: "£1,980",
      status: "active"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Clinic Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{clinicData.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {clinicData.address}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-100 text-green-800">
                Clinic Active
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Clinic Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clinicData.teamSize}</div>
              <p className="text-xs text-muted-foreground">Active professionals</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clinicData.monthlyRevenue}</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clinicData.totalBookings}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Locations</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clinicData.locations}</div>
              <p className="text-xs text-muted-foreground">Active sites</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Clinic Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Clinic Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Revenue</span>
                      <span className="font-bold">{clinicData.monthlyRevenue}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Services</span>
                      <span className="font-bold">{clinicData.activeServices}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Patient Satisfaction</span>
                      <span className="font-bold">4.8/5 ⭐</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {teamMembers.slice(0, 3).map((member, index) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="text-sm">{member.name}</span>
                        </div>
                        <span className="text-sm font-medium">{member.revenue}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Team Management Tab */}
          <TabsContent value="team" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Team Management</h3>
                <p className="text-sm text-muted-foreground">Manage your clinic's healthcare professionals</p>
              </div>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Team Member
              </Button>
            </div>

            <div className="space-y-4">
              {teamMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{member.name}</h4>
                          <Badge variant="outline">{member.role}</Badge>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            {member.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span><strong>Bookings:</strong> {member.bookings}</span>
                          <span><strong>Revenue:</strong> {member.revenue}</span>
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

          {/* Combined Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Clinic-Wide Calendar</h3>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h4 className="text-lg font-medium mb-2">Combined Calendar View</h4>
                    <p className="text-muted-foreground mb-4">
                      View all team appointments in one place. Filter by staff member or service type.
                    </p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Configure Calendar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Clinic Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Clinic Earnings</h3>
              
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>Earnings by team member this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role} • {member.bookings} bookings</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{member.revenue}</p>
                          <p className="text-xs text-muted-foreground">This month</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}