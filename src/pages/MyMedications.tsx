import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAuth } from '@/contexts/EnhancedAuthContext'
import { patientPortalService, Medication } from '@/services/patientPortalService'
import { toast } from '@/hooks/use-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { 
  Pill, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react'
import { format } from 'date-fns'

export default function MyMedications() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [medications, setMedications] = useState<Medication[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null)
  const [formData, setFormData] = useState({
    medication_name: '',
    dosage: '',
    frequency: '',
    prescribed_by: '',
    prescription_date: '',
    start_date: '',
    end_date: '',
    status: 'active' as 'active' | 'completed' | 'discontinued',
    notes: '',
    side_effects: ''
  })

  useEffect(() => {
    if (user) {
      loadMedications()
    }
  }, [user])

  const loadMedications = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await patientPortalService.getMedications(user.id)
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load medications",
          variant: "destructive",
        })
      } else {
        setMedications((data || []) as Medication[])
      }
    } catch (error) {
      console.error('Error loading medications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMedication = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const { error } = await patientPortalService.addMedication({
        user_id: user.id,
        ...formData
      })

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add medication",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Medication added successfully",
        })
        setIsAddDialogOpen(false)
        resetForm()
        loadMedications()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add medication",
        variant: "destructive",
      })
    }
  }

  const handleEditMedication = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !editingMedication) return

    try {
      const { error } = await patientPortalService.updateMedication(editingMedication.id, formData)

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update medication",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Medication updated successfully",
        })
        setIsEditDialogOpen(false)
        setEditingMedication(null)
        resetForm()
        loadMedications()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update medication",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (medication: Medication) => {
    setEditingMedication(medication)
    setFormData({
      medication_name: medication.medication_name,
      dosage: medication.dosage || '',
      frequency: medication.frequency || '',
      prescribed_by: medication.prescribed_by || '',
      prescription_date: medication.prescription_date || '',
      start_date: medication.start_date || '',
      end_date: medication.end_date || '',
      status: medication.status,
      notes: medication.notes || '',
      side_effects: medication.side_effects || ''
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      medication_name: '',
      dosage: '',
      frequency: '',
      prescribed_by: '',
      prescription_date: '',
      start_date: '',
      end_date: '',
      status: 'active',
      notes: '',
      side_effects: ''
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default', label: 'Active', icon: CheckCircle },
      completed: { variant: 'secondary', label: 'Completed', icon: CheckCircle },
      discontinued: { variant: 'destructive', label: 'Discontinued', icon: AlertTriangle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary', label: status, icon: Clock }
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const activeMedications = medications.filter(m => m.status === 'active')
  const inactiveMedications = medications.filter(m => m.status !== 'active')

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please sign in to view your medications.</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <Pill className="h-8 w-8" />
                My Medications
              </h1>
              <p className="text-muted-foreground">
                Track your prescriptions, dosages, and medication history
              </p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Medication
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Medication</DialogTitle>
                  <DialogDescription>
                    Enter the details of your new medication or prescription
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleAddMedication} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="medication_name">Medication Name *</Label>
                      <Input
                        id="medication_name"
                        value={formData.medication_name}
                        onChange={(e) => setFormData({ ...formData, medication_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dosage">Dosage</Label>
                      <Input
                        id="dosage"
                        placeholder="e.g., 500mg"
                        value={formData.dosage}
                        onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequency</Label>
                      <Input
                        id="frequency"
                        placeholder="e.g., Once daily, Twice daily"
                        value={formData.frequency}
                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prescribed_by">Prescribed By</Label>
                      <Input
                        id="prescribed_by"
                        placeholder="Doctor name"
                        value={formData.prescribed_by}
                        onChange={(e) => setFormData({ ...formData, prescribed_by: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prescription_date">Prescription Date</Label>
                      <Input
                        id="prescription_date"
                        type="date"
                        value={formData.prescription_date}
                        onChange={(e) => setFormData({ ...formData, prescription_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_date">End Date</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="discontinued">Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional notes about this medication"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="side_effects">Side Effects</Label>
                    <Textarea
                      id="side_effects"
                      placeholder="Any side effects experienced"
                      value={formData.side_effects}
                      onChange={(e) => setFormData({ ...formData, side_effects: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Add Medication
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Medications</p>
                  <p className="text-2xl font-bold text-green-600">{activeMedications.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Medications</p>
                  <p className="text-2xl font-bold">{medications.length}</p>
                </div>
                <Pill className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Discontinued</p>
                  <p className="text-2xl font-bold text-red-600">
                    {medications.filter(m => m.status === 'discontinued').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Medications */}
        {activeMedications.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Active Medications
              </CardTitle>
              <CardDescription>
                Medications you are currently taking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeMedications.map((medication) => (
                  <div key={medication.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{medication.medication_name}</h3>
                          {getStatusBadge(medication.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                          {medication.dosage && (
                            <div>Dosage: {medication.dosage}</div>
                          )}
                          {medication.frequency && (
                            <div>Frequency: {medication.frequency}</div>
                          )}
                          {medication.prescribed_by && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {medication.prescribed_by}
                            </div>
                          )}
                        </div>

                        {medication.start_date && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                            <Calendar className="h-4 w-4" />
                            Started: {format(new Date(medication.start_date), 'MMM dd, yyyy')}
                            {medication.end_date && (
                              <span> • Ends: {format(new Date(medication.end_date), 'MMM dd, yyyy')}</span>
                            )}
                          </div>
                        )}

                        {medication.notes && (
                          <div className="bg-muted/50 p-3 rounded-lg mb-2">
                            <p className="text-sm">{medication.notes}</p>
                          </div>
                        )}

                        {medication.side_effects && (
                          <div className="border-l-4 border-orange-500 pl-4">
                            <p className="text-sm font-medium text-orange-700">Side Effects:</p>
                            <p className="text-sm text-muted-foreground">{medication.side_effects}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(medication)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medication History */}
        {inactiveMedications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Medication History
              </CardTitle>
              <CardDescription>
                Previously taken medications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inactiveMedications.map((medication) => (
                  <div key={medication.id} className="border rounded-lg p-4 opacity-75">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{medication.medication_name}</h3>
                          {getStatusBadge(medication.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                          {medication.dosage && (
                            <div>Dosage: {medication.dosage}</div>
                          )}
                          {medication.frequency && (
                            <div>Frequency: {medication.frequency}</div>
                          )}
                          {medication.prescribed_by && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {medication.prescribed_by}
                            </div>
                          )}
                        </div>

                        {(medication.start_date || medication.end_date) && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                            <Calendar className="h-4 w-4" />
                            {medication.start_date && `Started: ${format(new Date(medication.start_date), 'MMM dd, yyyy')}`}
                            {medication.end_date && ` • Ended: ${format(new Date(medication.end_date), 'MMM dd, yyyy')}`}
                          </div>
                        )}

                        {medication.notes && (
                          <div className="bg-muted/30 p-3 rounded-lg mb-2">
                            <p className="text-sm">{medication.notes}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(medication)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading medications...</p>
            </CardContent>
          </Card>
        ) : medications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Pill className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Medications Added</h3>
              <p className="text-muted-foreground mb-4">
                Start tracking your medications and prescriptions
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Medication
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Medication</DialogTitle>
              <DialogDescription>
                Update the details of your medication
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleEditMedication} className="space-y-4">
              {/* Same form fields as add dialog */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_medication_name">Medication Name *</Label>
                  <Input
                    id="edit_medication_name"
                    value={formData.medication_name}
                    onChange={(e) => setFormData({ ...formData, medication_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_dosage">Dosage</Label>
                  <Input
                    id="edit_dosage"
                    placeholder="e.g., 500mg"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_frequency">Frequency</Label>
                  <Input
                    id="edit_frequency"
                    placeholder="e.g., Once daily, Twice daily"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_prescribed_by">Prescribed By</Label>
                  <Input
                    id="edit_prescribed_by"
                    placeholder="Doctor name"
                    value={formData.prescribed_by}
                    onChange={(e) => setFormData({ ...formData, prescribed_by: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_prescription_date">Prescription Date</Label>
                  <Input
                    id="edit_prescription_date"
                    type="date"
                    value={formData.prescription_date}
                    onChange={(e) => setFormData({ ...formData, prescription_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_start_date">Start Date</Label>
                  <Input
                    id="edit_start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_end_date">End Date</Label>
                  <Input
                    id="edit_end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_notes">Notes</Label>
                <Textarea
                  id="edit_notes"
                  placeholder="Additional notes about this medication"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_side_effects">Side Effects</Label>
                <Textarea
                  id="edit_side_effects"
                  placeholder="Any side effects experienced"
                  value={formData.side_effects}
                  onChange={(e) => setFormData({ ...formData, side_effects: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Update Medication
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  )
}