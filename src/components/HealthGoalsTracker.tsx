import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Target, Calendar, TrendingUp, Award, Plus, Edit, CheckCircle, Clock, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/EnhancedAuthContext';

interface HealthGoal {
  id: string;
  user_id: string;
  goal_type: string;
  title: string;
  description?: string;
  target_value?: number;
  target_unit?: string;
  current_value?: number;
  target_date?: string;
  status: string;
  progress_percentage: number;
  created_by?: string;
  reminders_enabled: boolean;
  reminder_frequency: string;
  created_at: string;
  updated_at: string;
}

const goalTypes = [
  { id: 'weight_loss', name: 'Weight Loss', unit: 'kg', icon: Target },
  { id: 'weight_gain', name: 'Weight Gain', unit: 'kg', icon: Target },
  { id: 'exercise', name: 'Exercise', unit: 'days/week', icon: TrendingUp },
  { id: 'steps', name: 'Daily Steps', unit: 'steps', icon: TrendingUp },
  { id: 'medication_adherence', name: 'Medication Adherence', unit: '%', icon: CheckCircle },
  { id: 'blood_pressure', name: 'Blood Pressure Control', unit: 'mmHg', icon: Target },
  { id: 'sleep', name: 'Sleep Quality', unit: 'hours', icon: Clock },
  { id: 'hydration', name: 'Daily Water Intake', unit: 'liters', icon: Target },
];

const reminderFrequencies = [
  { id: 'daily', name: 'Daily' },
  { id: 'weekly', name: 'Weekly' },
  { id: 'monthly', name: 'Monthly' },
];

const statuses = [
  { id: 'active', name: 'Active', variant: 'default' as const },
  { id: 'completed', name: 'Completed', variant: 'default' as const },
  { id: 'paused', name: 'Paused', variant: 'secondary' as const },
  { id: 'cancelled', name: 'Cancelled', variant: 'outline' as const },
];

export function HealthGoalsTracker() {
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingGoal, setEditingGoal] = useState<HealthGoal | null>(null);
  const [newGoal, setNewGoal] = useState({
    goal_type: '',
    title: '',
    description: '',
    target_value: '',
    target_date: '',
    reminders_enabled: true,
    reminder_frequency: 'daily',
  });
  const [updateValue, setUpdateValue] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('health_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching health goals:', error);
      toast({
        title: "Error",
        description: "Failed to load health goals",
        variant: "destructive",
      });
    }
  };

  const createGoal = async () => {
    if (!newGoal.goal_type || !newGoal.title || !newGoal.target_value) {
      return;
    }

    setLoading(true);
    try {
      const goalType = goalTypes.find(t => t.id === newGoal.goal_type);
      
      const { error } = await supabase
        .from('health_goals')
        .insert({
          user_id: user?.id,
          goal_type: newGoal.goal_type,
          title: newGoal.title,
          description: newGoal.description || null,
          target_value: parseFloat(newGoal.target_value),
          target_unit: goalType?.unit || '',
          target_date: newGoal.target_date || null,
          reminders_enabled: newGoal.reminders_enabled,
          reminder_frequency: newGoal.reminder_frequency,
          current_value: 0,
          progress_percentage: 0,
          status: 'active',
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Health goal created successfully",
      });

      // Reset form
      setNewGoal({
        goal_type: '',
        title: '',
        description: '',
        target_value: '',
        target_date: '',
        reminders_enabled: true,
        reminder_frequency: 'daily',
      });
      setIsCreating(false);
      
      // Refresh goals
      fetchGoals();
    } catch (error) {
      console.error('Error creating health goal:', error);
      toast({
        title: "Error",
        description: "Failed to create health goal",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateGoalProgress = async (goalId: string, newValue: number) => {
    setLoading(true);
    try {
      const { error } = await supabase.rpc('update_health_goal_progress', {
        _goal_id: goalId,
        _current_value: newValue,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Progress updated successfully",
      });

      setUpdateValue('');
      fetchGoals();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateGoalStatus = async (goalId: string, newStatus: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('health_goals')
        .update({ status: newStatus })
        .eq('id', goalId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Goal status updated",
      });

      fetchGoals();
    } catch (error) {
      console.error('Error updating goal status:', error);
      toast({
        title: "Error",
        description: "Failed to update goal status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusInfo = statuses.find(s => s.id === status);
    return (
      <Badge variant={statusInfo?.variant || 'default'}>
        {statusInfo?.name || status}
      </Badge>
    );
  };

  const getGoalIcon = (type: string) => {
    const goalType = goalTypes.find(t => t.id === type);
    const Icon = goalType?.icon || Target;
    return <Icon className="h-4 w-4" />;
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Health Goals</h2>
          <p className="text-muted-foreground">Set and track your health objectives</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Create/Edit Goal Form */}
      {(isCreating || editingGoal) && (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? 'Create New Goal' : 'Edit Goal'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal-type">Goal Type</Label>
                <Select 
                  value={newGoal.goal_type} 
                  onValueChange={(value) => setNewGoal({...newGoal, goal_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalTypes.map(type => (
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

              <div className="space-y-2">
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  placeholder="Enter goal title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-value">
                  Target Value ({goalTypes.find(t => t.id === newGoal.goal_type)?.unit || 'units'})
                </Label>
                <Input
                  id="target-value"
                  type="number"
                  step="0.1"
                  value={newGoal.target_value}
                  onChange={(e) => setNewGoal({...newGoal, target_value: e.target.value})}
                  placeholder="Enter target value"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-date">Target Date (Optional)</Label>
                <Input
                  id="target-date"
                  type="date"
                  value={newGoal.target_date}
                  onChange={(e) => setNewGoal({...newGoal, target_date: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminder-frequency">Reminder Frequency</Label>
                <Select 
                  value={newGoal.reminder_frequency} 
                  onValueChange={(value) => setNewGoal({...newGoal, reminder_frequency: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reminderFrequencies.map(freq => (
                      <SelectItem key={freq.id} value={freq.id}>
                        {freq.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="reminders"
                  checked={newGoal.reminders_enabled}
                  onCheckedChange={(checked) => setNewGoal({...newGoal, reminders_enabled: checked})}
                />
                <Label htmlFor="reminders">Enable Reminders</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                placeholder="Describe your goal in detail..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={createGoal} disabled={loading}>
                {loading ? "Creating..." : isCreating ? "Create Goal" : "Update Goal"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setEditingGoal(null);
                  setNewGoal({
                    goal_type: '',
                    title: '',
                    description: '',
                    target_value: '',
                    target_date: '',
                    reminders_enabled: true,
                    reminder_frequency: 'daily',
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Active Goals
          </CardTitle>
          <CardDescription>Goals you're currently working on</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activeGoals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No active goals yet. Create your first goal to get started!
              </p>
            ) : (
              activeGoals.map((goal) => (
                <div key={goal.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getGoalIcon(goal.goal_type)}
                        <h3 className="font-semibold">{goal.title}</h3>
                        {getStatusBadge(goal.status)}
                        {goal.reminders_enabled && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Bell className="h-3 w-3" />
                            {reminderFrequencies.find(f => f.id === goal.reminder_frequency)?.name}
                          </Badge>
                        )}
                      </div>
                      
                      {goal.description && (
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      )}

                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="font-medium">Current:</span> {goal.current_value || 0} {goal.target_unit}
                        </div>
                        <div>
                          <span className="font-medium">Target:</span> {goal.target_value} {goal.target_unit}
                        </div>
                        {goal.target_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className="font-medium">Due:</span> {new Date(goal.target_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    <Select
                      value={goal.status}
                      onValueChange={(value) => updateGoalStatus(goal.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map(status => (
                          <SelectItem key={status.id} value={status.id}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress_percentage}%</span>
                    </div>
                    <Progress value={goal.progress_percentage} className="h-2" />
                  </div>

                  {/* Update Progress */}
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      placeholder={`Enter current ${goal.target_unit}`}
                      value={updateValue}
                      onChange={(e) => setUpdateValue(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        if (updateValue) {
                          updateGoalProgress(goal.id, parseFloat(updateValue));
                        }
                      }}
                      disabled={loading || !updateValue}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Completed Goals
            </CardTitle>
            <CardDescription>Goals you've successfully achieved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-medium">{goal.title}</h3>
                      <div className="text-sm text-muted-foreground">
                        Achieved: {goal.target_value} {goal.target_unit}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    Completed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}