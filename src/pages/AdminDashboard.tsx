import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Shield, 
  Users, 
  Settings, 
  Database, 
  UserCheck, 
  Trash2,
  Edit,
  Crown,
  Activity
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface User {
  user_id: string;
  email: string;
  full_name: string;
  user_type: string;
  created_at: string;
  roles: string[];
}

export default function AdminDashboard() {
  const { hasRole } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [newRole, setNewRole] = useState<'admin' | 'doctor' | 'patient' | 'clinic_staff'>('patient');

  const isAdmin = hasRole('admin');

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Get all users first
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, full_name, user_type, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine the data
      const formattedUsers = profiles?.map(user => ({
        ...user,
        roles: userRoles?.filter(role => role.user_id === user.user_id).map(r => r.role) || []
      })) || [];

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId: string, role: 'admin' | 'doctor' | 'patient' | 'clinic_staff') => {
    try {
      // Insert new role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (roleError) throw roleError;

      // Update user type in profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ user_type: role })
        .eq('user_id', userId);

      if (profileError) throw profileError;

      toast({
        title: "Success",
        description: `Role ${role} assigned successfully`,
      });

      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error", 
        description: "Failed to assign role",
        variant: "destructive"
      });
    }
  };

  const removeRole = async (userId: string, role: 'admin' | 'doctor' | 'patient' | 'clinic_staff') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Role ${role} removed successfully`,
      });

      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: "Error",
        description: "Failed to remove role",
        variant: "destructive"
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Access denied. Super Admin only.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Full Access
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Role Management
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  All Platform Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={fetchUsers} disabled={loading}>
                    {loading ? 'Loading...' : 'Refresh Users'}
                  </Button>
                  
                  <div className="grid gap-4">
                    {users.map((user) => (
                      <Card key={user.user_id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-medium">{user.full_name || user.email}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex gap-2">
                              {user.roles.map((role) => (
                                <Badge 
                                  key={role} 
                                  variant={role === 'admin' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <select
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value as 'admin' | 'doctor' | 'patient' | 'clinic_staff')}
                              className="px-3 py-1 border rounded text-sm"
                            >
                              <option value="patient">Patient</option>
                              <option value="doctor">Doctor</option>
                              <option value="clinic_staff">Clinic Staff</option>
                              <option value="admin">Admin</option>
                            </select>
                            <Button
                              size="sm"
                              onClick={() => assignRole(user.user_id, newRole)}
                            >
                              Assign Role
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles">
            <Card>
              <CardHeader>
                <CardTitle>Role Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <h3 className="font-semibold text-red-600">Admin Role</h3>
                      <p className="text-sm text-muted-foreground">Full system access</p>
                      <Badge variant="destructive" className="mt-2">High Priority</Badge>
                    </Card>
                    <Card className="p-4">
                      <h3 className="font-semibold text-blue-600">Doctor Role</h3>
                      <p className="text-sm text-muted-foreground">Medical staff access</p>
                      <Badge variant="secondary" className="mt-2">Medical</Badge>
                    </Card>
                    <Card className="p-4">
                      <h3 className="font-semibold text-green-600">Patient Role</h3>
                      <p className="text-sm text-muted-foreground">Basic user access</p>
                      <Badge variant="outline" className="mt-2">Standard</Badge>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    As super admin, you have full database access through Supabase dashboard.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4 text-center">
                      <Activity className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <p className="font-semibold">Profiles</p>
                      <p className="text-2xl font-bold">{users.length}</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p className="font-semibold">Admins</p>
                      <p className="text-2xl font-bold">
                        {users.filter(u => u.roles.includes('admin')).length}
                      </p>
                    </Card>
                    <Card className="p-4 text-center">
                      <UserCheck className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <p className="font-semibold">Doctors</p>
                      <p className="text-2xl font-bold">
                        {users.filter(u => u.roles.includes('doctor')).length}
                      </p>
                    </Card>
                    <Card className="p-4 text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                      <p className="font-semibold">Patients</p>
                      <p className="text-2xl font-bold">
                        {users.filter(u => u.roles.includes('patient')).length}
                      </p>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    System-wide configuration and platform controls.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Platform Configuration
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Security Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Activity className="h-4 w-4 mr-2" />
                      System Monitoring
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}