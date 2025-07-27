import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Download, 
  CheckCircle, 
  Clock, 
  Users,
  DollarSign,
  Award,
  TrendingUp
} from "lucide-react";

export default function AdminReferrals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock referral data for admin view
  const mockAdminReferrals = [
    {
      id: 1,
      referrerName: "Dr. John Smith",
      referrerEmail: "john.smith@example.com", 
      referredName: "Dr. Sarah Wilson",
      referredEmail: "sarah.wilson@example.com",
      joinedDate: "2024-01-10",
      bookingsCompleted: 7,
      rewardAmount: 100,
      rewardPaid: true,
      paidDate: "2024-01-25",
      status: "Completed"
    },
    {
      id: 2,
      referrerName: "Dr. Michael Brown",
      referrerEmail: "michael.brown@example.com",
      referredName: "Nurse Emma Taylor", 
      referredEmail: "emma.taylor@example.com",
      joinedDate: "2024-01-20",
      bookingsCompleted: 3,
      rewardAmount: 100,
      rewardPaid: false,
      paidDate: null,
      status: "In Progress"
    },
    {
      id: 3,
      referrerName: "Dr. John Smith",
      referrerEmail: "john.smith@example.com",
      referredName: "Dr. Michael Chen",
      referredEmail: "michael.chen@example.com",
      joinedDate: "2024-01-25", 
      bookingsCompleted: 5,
      rewardAmount: 100,
      rewardPaid: false,
      paidDate: null,
      status: "Ready to Pay"
    },
    {
      id: 4,
      referrerName: "Nurse Lisa Johnson",
      referrerEmail: "lisa.johnson@example.com",
      referredName: "Dr. Alex Thompson",
      referredEmail: "alex.thompson@example.com",
      joinedDate: "2024-02-01",
      bookingsCompleted: 1,
      rewardAmount: 100,
      rewardPaid: false,
      paidDate: null,
      status: "In Progress"
    }
  ];

  const filteredReferrals = mockAdminReferrals.filter(referral => {
    const matchesSearch = referral.referrerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.referredName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.referrerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.referredEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || referral.status.toLowerCase().includes(statusFilter);
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case "Ready to Pay":
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Ready to Pay</Badge>;
      case "In Progress":
        return <Badge variant="secondary">In Progress</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculate stats
  const totalReferrals = mockAdminReferrals.length;
  const completedReferrals = mockAdminReferrals.filter(r => r.rewardPaid).length;
  const pendingPayouts = mockAdminReferrals.filter(r => r.status === "Ready to Pay").length;
  const totalPaid = mockAdminReferrals.filter(r => r.rewardPaid).reduce((sum, r) => sum + r.rewardAmount, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Referral Management</h1>
          <p className="text-muted-foreground">Track and manage partner referrals and rewards</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReferrals}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedReferrals}</div>
              <p className="text-xs text-muted-foreground">Rewards paid out</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPayouts}</div>
              <p className="text-xs text-muted-foreground">Ready for payment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£{totalPaid}</div>
              <p className="text-xs text-muted-foreground">In referral rewards</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Referral Tracking</CardTitle>
            <CardDescription>Monitor partner referrals and process rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by referrer or referred partner..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="ready">Ready to Pay</SelectItem>
                  <SelectItem value="progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>

            {/* Referrals Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referrer</TableHead>
                    <TableHead>Referred Partner</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReferrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{referral.referrerName}</div>
                          <div className="text-sm text-muted-foreground">{referral.referrerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{referral.referredName}</div>
                          <div className="text-sm text-muted-foreground">{referral.referredEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{referral.joinedDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{referral.bookingsCompleted}/5</span>
                          {referral.bookingsCompleted >= 5 && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(referral.status)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">£{referral.rewardAmount}</div>
                          {referral.rewardPaid && (
                            <div className="text-xs text-muted-foreground">Paid: {referral.paidDate}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {referral.status === "Ready to Pay" && (
                          <Button size="sm" variant="default">
                            Process Payment
                          </Button>
                        )}
                        {referral.rewardPaid && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            ✓ Paid
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Referrers This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Dr. John Smith", referrals: 3, earned: 200 },
                { name: "Dr. Michael Brown", referrals: 2, earned: 100 },
                { name: "Nurse Lisa Johnson", referrals: 1, earned: 0 }
              ].map((leader, index) => (
                <div key={leader.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{leader.name}</div>
                      <div className="text-sm text-muted-foreground">{leader.referrals} referrals</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">£{leader.earned}</div>
                    <div className="text-sm text-muted-foreground">earned</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}