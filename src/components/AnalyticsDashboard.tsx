import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Activity, Pill, Target, TrendingUp, AlertTriangle, Heart, Users, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  appointments: {
    total: number;
    upcoming: number;
    completed: number;
    cancelled: number;
  };
  prescriptions: {
    active: number;
    expiring: number;
    total: number;
  };
  healthGoals: {
    active: number;
    completed: number;
    averageProgress: number;
  };
  healthMetrics: {
    totalEntries: number;
    flaggedValues: number;
    lastEntry: string | null;
  };
}

interface HealthTrend {
  date: string;
  weight?: number;
  bloodPressure?: number;
  heartRate?: number;
  glucose?: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export function AnalyticsDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    appointments: { total: 0, upcoming: 0, completed: 0, cancelled: 0 },
    prescriptions: { active: 0, expiring: 0, total: 0 },
    healthGoals: { active: 0, completed: 0, averageProgress: 0 },
    healthMetrics: { totalEntries: 0, flaggedValues: 0, lastEntry: null },
  });
  const [healthTrends, setHealthTrends] = useState<HealthTrend[]>([]);
  const [appointmentTrends, setAppointmentTrends] = useState<any[]>([]);
  const [medicationAdherence, setMedicationAdherence] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchHealthTrends(),
        fetchAppointmentTrends(),
        fetchMedicationAdherence(),
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch appointments stats
      const { data: appointments } = await supabase
        .from('appointments')
        .select('status, appointment_date');

      const now = new Date();
      const appointmentStats = {
        total: appointments?.length || 0,
        upcoming: appointments?.filter(a => new Date(a.appointment_date) > now && a.status === 'scheduled').length || 0,
        completed: appointments?.filter(a => a.status === 'completed').length || 0,
        cancelled: appointments?.filter(a => a.status === 'cancelled').length || 0,
      };

      // Fetch prescriptions stats
      const { data: prescriptions } = await supabase
        .from('prescriptions')
        .select('status, end_date');

      const activePresc = prescriptions?.filter(p => p.status === 'active') || [];
      const expiringPresc = activePresc.filter(p => {
        if (!p.end_date) return false;
        const endDate = new Date(p.end_date);
        const daysUntil = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntil <= 7 && daysUntil > 0;
      });

      const prescriptionStats = {
        active: activePresc.length,
        expiring: expiringPresc.length,
        total: prescriptions?.length || 0,
      };

      // Fetch health goals stats
      const { data: healthGoals } = await supabase
        .from('health_goals')
        .select('status, progress_percentage');

      const activeGoals = healthGoals?.filter(g => g.status === 'active') || [];
      const completedGoals = healthGoals?.filter(g => g.status === 'completed') || [];
      const avgProgress = activeGoals.length > 0 
        ? activeGoals.reduce((sum, g) => sum + g.progress_percentage, 0) / activeGoals.length 
        : 0;

      const goalsStats = {
        active: activeGoals.length,
        completed: completedGoals.length,
        averageProgress: Math.round(avgProgress),
      };

      // Fetch health metrics stats
      const { data: healthMetrics } = await supabase
        .from('health_metrics')
        .select('is_flagged, measured_at')
        .order('measured_at', { ascending: false });

      const metricsStats = {
        totalEntries: healthMetrics?.length || 0,
        flaggedValues: healthMetrics?.filter(m => m.is_flagged).length || 0,
        lastEntry: healthMetrics?.[0]?.measured_at || null,
      };

      setStats({
        appointments: appointmentStats,
        prescriptions: prescriptionStats,
        healthGoals: goalsStats,
        healthMetrics: metricsStats,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchHealthTrends = async () => {
    try {
      const { data: metrics } = await supabase
        .from('health_metrics')
        .select('metric_type, value, measured_at')
        .order('measured_at', { ascending: true })
        .limit(30);

      if (!metrics) return;

      // Group by date and metric type
      const trendData: { [key: string]: HealthTrend } = {};
      
      metrics.forEach(metric => {
        const date = new Date(metric.measured_at).toLocaleDateString();
        if (!trendData[date]) {
          trendData[date] = { date };
        }

        const value = typeof metric.value === 'object' && metric.value !== null ? 
          ((metric.value as any).systolic || (metric.value as any).value) : metric.value;

        switch (metric.metric_type) {
          case 'weight':
            trendData[date].weight = parseFloat(value);
            break;
          case 'blood_pressure':
            trendData[date].bloodPressure = parseFloat(value);
            break;
          case 'heart_rate':
            trendData[date].heartRate = parseFloat(value);
            break;
          case 'glucose':
            trendData[date].glucose = parseFloat(value);
            break;
        }
      });

      setHealthTrends(Object.values(trendData));
    } catch (error) {
      console.error('Error fetching health trends:', error);
    }
  };

  const fetchAppointmentTrends = async () => {
    try {
      const { data: appointments } = await supabase
        .from('appointments')
        .select('appointment_date, status')
        .order('appointment_date', { ascending: true });

      if (!appointments) return;

      // Group by month
      const monthlyData: { [key: string]: { month: string; total: number; completed: number; cancelled: number } } = {};
      
      appointments.forEach(apt => {
        const month = new Date(apt.appointment_date).toLocaleDateString('en', { year: 'numeric', month: 'short' });
        if (!monthlyData[month]) {
          monthlyData[month] = { month, total: 0, completed: 0, cancelled: 0 };
        }
        monthlyData[month].total++;
        if (apt.status === 'completed') monthlyData[month].completed++;
        if (apt.status === 'cancelled') monthlyData[month].cancelled++;
      });

      setAppointmentTrends(Object.values(monthlyData));
    } catch (error) {
      console.error('Error fetching appointment trends:', error);
    }
  };

  const fetchMedicationAdherence = async () => {
    try {
      const { data: prescriptions } = await supabase
        .from('prescriptions')
        .select('medication_name, status, prescribed_date');

      if (!prescriptions) return;

      const adherenceData = prescriptions.reduce((acc: any, presc) => {
        const status = presc.status;
        if (!acc[status]) acc[status] = { name: status, value: 0 };
        acc[status].value++;
        return acc;
      }, {});

      setMedicationAdherence(Object.values(adherenceData));
    } catch (error) {
      console.error('Error fetching medication adherence:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Health Analytics</h2>
          <p className="text-muted-foreground">Comprehensive insights into your health journey</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline">
          <TrendingUp className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.appointments.total}</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="default" className="text-xs">{stats.appointments.upcoming} upcoming</Badge>
              <Badge variant="secondary" className="text-xs">{stats.appointments.completed} completed</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.prescriptions.active}</div>
            <div className="flex items-center gap-1 text-sm">
              {stats.prescriptions.expiring > 0 && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {stats.prescriptions.expiring} expiring
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.healthGoals.active}</div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Avg. Progress: {stats.healthGoals.averageProgress}%</div>
              <Progress value={stats.healthGoals.averageProgress} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Metrics</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.healthMetrics.totalEntries}</div>
            <div className="flex items-center gap-1 text-sm">
              {stats.healthMetrics.flaggedValues > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {stats.healthMetrics.flaggedValues} flagged
                </Badge>
              )}
              {stats.healthMetrics.lastEntry && (
                <span className="text-muted-foreground text-xs">
                  Last: {new Date(stats.healthMetrics.lastEntry).toLocaleDateString()}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="health-trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="health-trends">Health Trends</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="goals">Goals Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="health-trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Metrics Trends</CardTitle>
              <CardDescription>Track your vital health indicators over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke={COLORS[0]} name="Weight (kg)" />
                    <Line type="monotone" dataKey="bloodPressure" stroke={COLORS[1]} name="Blood Pressure" />
                    <Line type="monotone" dataKey="heartRate" stroke={COLORS[2]} name="Heart Rate" />
                    <Line type="monotone" dataKey="glucose" stroke={COLORS[3]} name="Glucose" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Trends</CardTitle>
              <CardDescription>Monthly appointment statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appointmentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill={COLORS[0]} name="Total" />
                    <Bar dataKey="completed" fill={COLORS[1]} name="Completed" />
                    <Bar dataKey="cancelled" fill={COLORS[2]} name="Cancelled" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medication Status Distribution</CardTitle>
              <CardDescription>Overview of your prescription statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={medicationAdherence}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {medicationAdherence.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Goal Achievement Summary</CardTitle>
              <CardDescription>Your progress towards health objectives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{stats.healthGoals.active}</div>
                  <div className="text-sm text-muted-foreground">Active Goals</div>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{stats.healthGoals.completed}</div>
                  <div className="text-sm text-muted-foreground">Completed Goals</div>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{stats.healthGoals.averageProgress}%</div>
                  <div className="text-sm text-muted-foreground">Average Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}