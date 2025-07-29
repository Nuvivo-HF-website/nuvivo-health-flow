import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from '@/contexts/AuthContext'
import { patientPortalService, TestResult } from '@/services/patientPortalService'
import { toast } from '@/hooks/use-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { 
  TestTube, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

export default function MyTestResults() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [filteredResults, setFilteredResults] = useState<TestResult[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    if (user) {
      loadTestResults()
    }
  }, [user])

  useEffect(() => {
    filterResults()
  }, [testResults, searchTerm, statusFilter, typeFilter])

  const loadTestResults = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await patientPortalService.getTestResults(user.id)
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load test results",
          variant: "destructive",
        })
      } else {
        setTestResults((data || []) as TestResult[])
      }
    } catch (error) {
      console.error('Error loading test results:', error)
      toast({
        title: "Error",
        description: "Failed to load test results",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterResults = () => {
    let filtered = testResults

    if (searchTerm) {
      filtered = filtered.filter(result => 
        result.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.test_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.clinic_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(result => result.result_status === statusFilter)
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(result => result.test_type === typeFilter)
    }

    setFilteredResults(filtered)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'abnormal':
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      normal: { variant: 'default', label: 'Normal' },
      abnormal: { variant: 'destructive', label: 'Abnormal' },
      critical: { variant: 'destructive', label: 'Critical' },
      pending: { variant: 'secondary', label: 'Pending' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary', label: status }
    return <Badge variant={config.variant as any}>{config.label}</Badge>
  }

  const uniqueTestTypes = Array.from(new Set(testResults.map(result => result.test_type)))

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please sign in to view your test results.</p>
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
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <TestTube className="h-8 w-8" />
            My Test Results
          </h1>
          <p className="text-muted-foreground">
            View and manage all your laboratory test results and health reports
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="abnormal">Abnormal</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTestTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setTypeFilter('all')
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Results</p>
                  <p className="text-2xl font-bold">{testResults.length}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Normal Results</p>
                  <p className="text-2xl font-bold text-green-600">
                    {testResults.filter(r => r.result_status === 'normal').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Abnormal Results</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {testResults.filter(r => r.result_status === 'abnormal').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Results</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {testResults.filter(r => r.result_status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Results List */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading test results...</p>
              </CardContent>
            </Card>
          ) : filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <Card key={result.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(result.result_status)}
                        <h3 className="text-lg font-semibold">{result.test_name}</h3>
                        {getStatusBadge(result.result_status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(result.test_date), 'MMM dd, yyyy')}
                        </div>
                        <div>
                          Test Type: {result.test_type}
                        </div>
                        {result.clinic_name && (
                          <div>
                            Clinic: {result.clinic_name}
                          </div>
                        )}
                      </div>

                      {result.doctor_name && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Doctor: {result.doctor_name}
                        </p>
                      )}

                      {result.ai_summary && (
                        <div className="bg-muted/50 p-3 rounded-lg mb-4">
                          <p className="text-sm">{result.ai_summary}</p>
                        </div>
                      )}

                      {result.doctor_notes && (
                        <div className="border-l-4 border-primary pl-4 mb-4">
                          <p className="text-sm font-medium">Doctor's Notes:</p>
                          <p className="text-sm text-muted-foreground">{result.doctor_notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/test-results/${result.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      
                      {result.file_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(result.file_url, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <TestTube className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Test Results Found</h3>
                <p className="text-muted-foreground mb-4">
                  {testResults.length === 0 
                    ? "You don't have any test results yet." 
                    : "No results match your current filters."}
                </p>
                <Button onClick={() => navigate('/blood-tests')}>
                  Book a Blood Test
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}