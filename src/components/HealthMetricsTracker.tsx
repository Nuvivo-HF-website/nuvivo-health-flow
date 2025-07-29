import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heart, Scale, Activity, Thermometer, Droplets, Plus, TrendingUp, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/EnhancedAuthContext';

interface HealthMetric {
  id: string;
  metric_type: string;
  value: any;
  unit: string;
  measured_at: string;
  device_source?: string;
  notes?: string;
  is_flagged: boolean;
}

const metricTypes = [
  { id: 'blood_pressure', name: 'Blood Pressure', unit: 'mmHg', icon: Heart },
  { id: 'weight', name: 'Weight', unit: 'kg', icon: Scale },
  { id: 'heart_rate', name: 'Heart Rate', unit: 'bpm', icon: Activity },
  { id: 'temperature', name: 'Temperature', unit: '°C', icon: Thermometer },
  { id: 'glucose', name: 'Blood Glucose', unit: 'mg/dL', icon: Droplets },
];

const deviceSources = [
  { id: 'manual', name: 'Manual Entry' },
  { id: 'smartphone', name: 'Smartphone App' },
  { id: 'wearable', name: 'Wearable Device' },
  { id: 'medical_device', name: 'Medical Device' },
];

export function HealthMetricsTracker() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [selectedMetricType, setSelectedMetricType] = useState('');
  const [metricValue, setMetricValue] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [deviceSource, setDeviceSource] = useState('manual');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchHealthMetrics();
    }
  }, [user]);

  useEffect(() => {
    if (selectedMetricType && metrics.length > 0) {
      prepareChartData();
    }
  }, [selectedMetricType, metrics]);

  const fetchHealthMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .order('measured_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load health metrics",
        variant: "destructive",
      });
    }
  };

  const prepareChartData = () => {
    const filteredMetrics = metrics
      .filter(m => m.metric_type === selectedMetricType)
      .slice(0, 10)
      .reverse();

    const data = filteredMetrics.map(metric => {
      const date = new Date(metric.measured_at).toLocaleDateString();
      let value = metric.value;
      
      if (metric.metric_type === 'blood_pressure' && typeof value === 'object') {
        value = value.systolic;
      } else if (typeof value === 'object') {
        value = value.value || 0;
      }

      return {
        date,
        value: parseFloat(value),
        fullDate: metric.measured_at,
      };
    });

    setChartData(data);
  };

  const addHealthMetric = async () => {
    if (!selectedMetricType || (!metricValue && selectedMetricType !== 'blood_pressure')) {
      return;
    }

    if (selectedMetricType === 'blood_pressure' && (!systolic || !diastolic)) {
      return;
    }

    setLoading(true);
    try {
      let value: any;
      const selectedType = metricTypes.find(t => t.id === selectedMetricType);

      if (selectedMetricType === 'blood_pressure') {
        value = { systolic: parseInt(systolic), diastolic: parseInt(diastolic) };
      } else {
        value = { value: parseFloat(metricValue) };
      }

      const { error } = await supabase
        .from('health_metrics')
        .insert({
          user_id: user?.id,
          metric_type: selectedMetricType,
          value,
          unit: selectedType?.unit || '',
          measured_at: new Date().toISOString(),
          device_source: deviceSource,
          notes: notes || null,
          is_flagged: false,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Health metric added successfully",
      });

      // Reset form
      setMetricValue('');
      setSystolic('');
      setDiastolic('');
      setNotes('');
      
      // Refresh metrics
      fetchHealthMetrics();
    } catch (error) {
      console.error('Error adding health metric:', error);
      toast({
        title: "Error",
        description: "Failed to add health metric",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMetricIcon = (type: string) => {
    const metricType = metricTypes.find(m => m.id === type);
    const Icon = metricType?.icon || Activity;
    return <Icon className="h-4 w-4" />;
  };

  const formatMetricValue = (metric: HealthMetric) => {
    if (metric.metric_type === 'blood_pressure' && typeof metric.value === 'object') {
      return `${metric.value.systolic}/${metric.value.diastolic} ${metric.unit}`;
    }
    
    const value = typeof metric.value === 'object' ? metric.value.value : metric.value;
    return `${value} ${metric.unit}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Health Metrics</h2>
          <p className="text-muted-foreground">Track and monitor your vital health indicators</p>
        </div>
      </div>

      {/* Add New Metric */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Metric
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="metric-type">Metric Type</Label>
              <Select value={selectedMetricType} onValueChange={setSelectedMetricType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric type" />
                </SelectTrigger>
                <SelectContent>
                  {metricTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        {React.createElement(type.icon, { className: "h-4 w-4" })}
                        {type.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedMetricType === 'blood_pressure' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="systolic">Systolic (mmHg)</Label>
                  <Input
                    id="systolic"
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    placeholder="120"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
                  <Input
                    id="diastolic"
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    placeholder="80"
                  />
                </div>
              </>
            ) : selectedMetricType && (
              <div className="space-y-2">
                <Label htmlFor="metric-value">
                  Value ({metricTypes.find(t => t.id === selectedMetricType)?.unit})
                </Label>
                <Input
                  id="metric-value"
                  type="number"
                  step="0.1"
                  value={metricValue}
                  onChange={(e) => setMetricValue(e.target.value)}
                  placeholder="Enter value"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="device-source">Source</Label>
              <Select value={deviceSource} onValueChange={setDeviceSource}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {deviceSources.map(source => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about this measurement..."
              rows={2}
            />
          </div>

          <Button onClick={addHealthMetric} disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Metric"}
          </Button>
        </CardContent>
      </Card>

      {/* Chart */}
      {selectedMetricType && chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {metricTypes.find(t => t.id === selectedMetricType)?.name} Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Measurements</CardTitle>
          <CardDescription>Your latest health metric entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No health metrics recorded yet. Add your first measurement above.
              </p>
            ) : (
              metrics.slice(0, 10).map((metric) => (
                <div
                  key={metric.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getMetricIcon(metric.metric_type)}
                    <div>
                      <div className="font-medium">
                        {metricTypes.find(t => t.id === metric.metric_type)?.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(metric.measured_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-semibold">{formatMetricValue(metric)}</div>
                      {metric.device_source && (
                        <div className="text-xs text-muted-foreground">
                          {deviceSources.find(s => s.id === metric.device_source)?.name}
                        </div>
                      )}
                    </div>
                    {metric.is_flagged && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Flagged
                      </Badge>
                    )}
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