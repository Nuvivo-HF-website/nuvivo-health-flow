import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Dna, 
  Shield, 
  Heart, 
  Brain, 
  Activity, 
  AlertTriangle, 
  TrendingUp,
  ChevronRight,
  Download,
  Share2,
  Eye,
  Clock,
  Target,
  Zap,
  FileText,
  Info
} from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

interface GeneticVariant {
  id: string
  gene: string
  variant: string
  rsid?: string
  genotype: string
  significance: 'pathogenic' | 'likely_pathogenic' | 'uncertain' | 'likely_benign' | 'benign'
  condition: string
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high'
  populationFrequency: number
  clinicalRelevance: string
  recommendations: string[]
  references: string[]
}

interface PharmacoGenetic {
  id: string
  drug: string
  gene: string
  variant: string
  metabolism: 'poor' | 'intermediate' | 'normal' | 'ultrarapid'
  recommendation: string
  dosageAdjustment: string
  alternativeOptions: string[]
  confidence: number
}

interface HealthRisk {
  condition: string
  riskScore: number
  geneticContribution: number
  lifestyleContribution: number
  environmentalContribution: number
  ageContribution: number
  populationAverage: number
  recommendations: string[]
}

export default function GenomicsAnalyzer() {
  const [activeTab, setActiveTab] = useState('overview')
  const [variants, setVariants] = useState<GeneticVariant[]>([])
  const [pharmacoGenetics, setPharmacoGenetics] = useState<PharmacoGenetic[]>([])
  const [healthRisks, setHealthRisks] = useState<HealthRisk[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<GeneticVariant | null>(null)

  useEffect(() => {
    // Simulate loading genomic data
    setTimeout(() => {
      setVariants(mockVariants)
      setPharmacoGenetics(mockPharmacoGenetics)
      setHealthRisks(mockHealthRisks)
      setIsLoading(false)
    }, 1500)
  }, [])

  const mockVariants: GeneticVariant[] = [
    {
      id: '1',
      gene: 'BRCA1',
      variant: 'c.185delAG',
      rsid: 'rs80357914',
      genotype: 'heterozygous',
      significance: 'pathogenic',
      condition: 'Hereditary Breast and Ovarian Cancer',
      riskLevel: 'high',
      populationFrequency: 0.0008,
      clinicalRelevance: 'High penetrance mutation associated with significantly increased risk of breast and ovarian cancer',
      recommendations: [
        'Enhanced surveillance with MRI and mammography',
        'Consider prophylactic surgery discussion',
        'Genetic counseling for family members',
        'Regular oncology consultations'
      ],
      references: ['ClinVar: 41004', 'PMID: 28158555']
    },
    {
      id: '2',
      gene: 'APOE',
      variant: 'ε4 allele',
      rsid: 'rs429358',
      genotype: 'heterozygous',
      significance: 'likely_pathogenic',
      condition: 'Alzheimer\'s Disease Risk',
      riskLevel: 'moderate',
      populationFrequency: 0.25,
      clinicalRelevance: 'Moderate increase in Alzheimer\'s disease risk, responds well to Mediterranean diet',
      recommendations: [
        'Mediterranean diet implementation',
        'Regular cognitive exercises',
        'Cardiovascular health optimization',
        'Annual cognitive assessments after age 65'
      ],
      references: ['PMID: 29507423', 'PMID: 31978330']
    },
    {
      id: '3',
      gene: 'CYP2D6',
      variant: '*4/*10',
      genotype: 'compound heterozygous',
      significance: 'uncertain',
      condition: 'Drug Metabolism Variation',
      riskLevel: 'moderate',
      populationFrequency: 0.12,
      clinicalRelevance: 'Intermediate metabolizer status affecting multiple medications',
      recommendations: [
        'Pharmacogenetic testing before prescriptions',
        'Monitor for drug interactions',
        'Consider alternative medications',
        'Regular therapeutic drug monitoring'
      ],
      references: ['PharmGKB: PA128', 'PMID: 32770672']
    }
  ]

  const mockPharmacoGenetics: PharmacoGenetic[] = [
    {
      id: '1',
      drug: 'Warfarin',
      gene: 'CYP2C9',
      variant: '*1/*3',
      metabolism: 'intermediate',
      recommendation: 'Reduced starting dose recommended',
      dosageAdjustment: 'Start with 2.5mg daily instead of 5mg',
      alternativeOptions: ['Apixaban', 'Rivaroxaban'],
      confidence: 92
    },
    {
      id: '2',
      drug: 'Clopidogrel',
      gene: 'CYP2C19',
      variant: '*2/*17',
      metabolism: 'normal',
      recommendation: 'Standard dosing appropriate',
      dosageAdjustment: 'No adjustment needed',
      alternativeOptions: ['Prasugrel', 'Ticagrelor'],
      confidence: 87
    },
    {
      id: '3',
      drug: 'Codeine',
      gene: 'CYP2D6',
      variant: '*4/*10',
      metabolism: 'poor',
      recommendation: 'Avoid use - reduced efficacy',
      dosageAdjustment: 'Contraindicated',
      alternativeOptions: ['Tramadol', 'Oxycodone', 'Morphine'],
      confidence: 96
    }
  ]

  const mockHealthRisks: HealthRisk[] = [
    {
      condition: 'Type 2 Diabetes',
      riskScore: 23.5,
      geneticContribution: 35,
      lifestyleContribution: 45,
      environmentalContribution: 15,
      ageContribution: 5,
      populationAverage: 11.0,
      recommendations: [
        'Maintain healthy BMI',
        'Regular exercise (150 min/week)',
        'Mediterranean diet pattern',
        'Annual glucose monitoring'
      ]
    },
    {
      condition: 'Cardiovascular Disease',
      riskScore: 18.2,
      geneticContribution: 25,
      lifestyleContribution: 55,
      environmentalContribution: 15,
      ageContribution: 5,
      populationAverage: 20.1,
      recommendations: [
        'Low sodium diet',
        'Regular cardio exercise',
        'Stress management',
        'Blood pressure monitoring'
      ]
    },
    {
      condition: 'Alzheimer\'s Disease',
      riskScore: 12.8,
      geneticContribution: 60,
      lifestyleContribution: 30,
      environmentalContribution: 10,
      ageContribution: 0,
      populationAverage: 8.5,
      recommendations: [
        'Cognitive training exercises',
        'Social engagement',
        'Mediterranean diet',
        'Quality sleep habits'
      ]
    }
  ]

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'pathogenic': return 'bg-red-50 text-red-700 border-red-200'
      case 'likely_pathogenic': return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'uncertain': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'likely_benign': return 'bg-green-50 text-green-700 border-green-200'
      case 'benign': return 'bg-green-50 text-green-700 border-green-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'very_high': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'moderate': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getMetabolismColor = (metabolism: string) => {
    switch (metabolism) {
      case 'poor': return 'bg-red-50 text-red-700'
      case 'intermediate': return 'bg-yellow-50 text-yellow-700'
      case 'normal': return 'bg-green-50 text-green-700'
      case 'ultrarapid': return 'bg-blue-50 text-blue-700'
      default: return 'bg-gray-50 text-gray-700'
    }
  }

  const riskDistributionData = healthRisks.map(risk => ({
    name: risk.condition.split(' ')[0],
    genetic: risk.geneticContribution,
    lifestyle: risk.lifestyleContribution,
    environmental: risk.environmentalContribution,
    age: risk.ageContribution
  }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Analyzing genomic data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dna className="h-5 w-5" />
            Genomics Analysis
          </CardTitle>
          <CardDescription>
            Comprehensive genetic analysis with actionable health insights and personalized recommendations
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="variants">Genetic Variants</TabsTrigger>
          <TabsTrigger value="pharmacogenomics">Drug Response</TabsTrigger>
          <TabsTrigger value="risk-assessment">Risk Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Genetic Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Dna className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Variants Analyzed</h3>
                </div>
                <div className="text-3xl font-bold mb-2">{variants.length}</div>
                <p className="text-sm text-muted-foreground">
                  Clinically relevant genetic variants
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <h3 className="font-semibold">High Risk Variants</h3>
                </div>
                <div className="text-3xl font-bold mb-2">
                  {variants.filter(v => v.riskLevel === 'high' || v.riskLevel === 'very_high').length}
                </div>
                <p className="text-sm text-muted-foreground">
                  Require clinical attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Heart className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold">Drug Interactions</h3>
                </div>
                <div className="text-3xl font-bold mb-2">{pharmacoGenetics.length}</div>
                <p className="text-sm text-muted-foreground">
                  Medications with genetic considerations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold">Protective Variants</h3>
                </div>
                <div className="text-3xl font-bold mb-2">
                  {variants.filter(v => v.significance === 'benign' || v.significance === 'likely_benign').length}
                </div>
                <p className="text-sm text-muted-foreground">
                  Beneficial genetic factors
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Risk Factor Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Health Risk Factor Distribution</CardTitle>
              <CardDescription>
                How genetics, lifestyle, environment, and age contribute to your health risks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="genetic" stackId="a" fill="#8884d8" name="Genetic" />
                    <Bar dataKey="lifestyle" stackId="a" fill="#82ca9d" name="Lifestyle" />
                    <Bar dataKey="environmental" stackId="a" fill="#ffc658" name="Environmental" />
                    <Bar dataKey="age" stackId="a" fill="#ff7300" name="Age" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Priority Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Priority Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {variants.filter(v => v.riskLevel === 'high' || v.riskLevel === 'very_high').map((variant) => (
                  <div key={variant.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{variant.gene} - {variant.condition}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{variant.clinicalRelevance}</p>
                      <div className="space-y-1">
                        {variant.recommendations.slice(0, 2).map((rec, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Genetic Variants</CardTitle>
              <CardDescription>
                Detailed analysis of clinically significant genetic variants in your genome
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {variants.map((variant) => (
                  <Card key={variant.id} className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Dna className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{variant.gene}</h3>
                          <p className="text-sm text-muted-foreground">{variant.variant}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSignificanceColor(variant.significance)}>
                          {variant.significance.replace('_', ' ')}
                        </Badge>
                        <Badge className={`${getRiskLevelColor(variant.riskLevel)}`}>
                          {variant.riskLevel} risk
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Clinical Information</h4>
                        <div className="space-y-2 text-sm">
                          <div><strong>Condition:</strong> {variant.condition}</div>
                          <div><strong>Genotype:</strong> {variant.genotype}</div>
                          {variant.rsid && <div><strong>rsID:</strong> {variant.rsid}</div>}
                          <div><strong>Population Frequency:</strong> {(variant.populationFrequency * 100).toFixed(3)}%</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Recommendations</h4>
                        <ul className="space-y-1">
                          {variant.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm">{variant.clinicalRelevance}</p>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedVariant(variant)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Report
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share with Provider
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pharmacogenomics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pharmacogenomics</CardTitle>
              <CardDescription>
                How your genetics affect drug metabolism and response
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pharmacoGenetics.map((pharma) => (
                  <Card key={pharma.id} className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Heart className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{pharma.drug}</h3>
                          <p className="text-sm text-muted-foreground">{pharma.gene} - {pharma.variant}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getMetabolismColor(pharma.metabolism)}>
                          {pharma.metabolism} metabolizer
                        </Badge>
                        <Badge variant="outline">
                          {pharma.confidence}% confidence
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Recommendation</h4>
                        <p className="text-sm mb-2">{pharma.recommendation}</p>
                        <div className="text-sm">
                          <strong>Dosage:</strong> {pharma.dosageAdjustment}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Alternative Options</h4>
                        <div className="flex flex-wrap gap-1">
                          {pharma.alternativeOptions.map((alt, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {alt}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk-assessment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Health Risk Assessment</CardTitle>
              <CardDescription>
                Your genetic predisposition to common health conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {healthRisks.map((risk, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{risk.condition}</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{risk.riskScore.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">
                          vs {risk.populationAverage.toFixed(1)}% average
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Your Risk</span>
                        <span>Population Average</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={risk.riskScore} className="flex-1" />
                        <div className="w-2 h-4 bg-gray-300 rounded" style={{ 
                          marginLeft: `${(risk.populationAverage / 30) * 100}%` 
                        }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Genetic</div>
                        <div className="font-semibold">{risk.geneticContribution}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Lifestyle</div>
                        <div className="font-semibold">{risk.lifestyleContribution}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Environmental</div>
                        <div className="font-semibold">{risk.environmentalContribution}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Age</div>
                        <div className="font-semibold">{risk.ageContribution}%</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {risk.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detailed Variant Dialog */}
      <Dialog open={!!selectedVariant} onOpenChange={() => setSelectedVariant(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedVariant?.gene} Variant Details</DialogTitle>
            <DialogDescription>
              Comprehensive information about this genetic variant
            </DialogDescription>
          </DialogHeader>
          {selectedVariant && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Genetic Information</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Gene:</strong> {selectedVariant.gene}</div>
                    <div><strong>Variant:</strong> {selectedVariant.variant}</div>
                    <div><strong>Genotype:</strong> {selectedVariant.genotype}</div>
                    {selectedVariant.rsid && <div><strong>rsID:</strong> {selectedVariant.rsid}</div>}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Clinical Significance</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Significance:</strong> {selectedVariant.significance}</div>
                    <div><strong>Risk Level:</strong> {selectedVariant.riskLevel}</div>
                    <div><strong>Population Frequency:</strong> {(selectedVariant.populationFrequency * 100).toFixed(3)}%</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Clinical Relevance</h4>
                <p className="text-sm">{selectedVariant.clinicalRelevance}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">References</h4>
                <div className="space-y-1">
                  {selectedVariant.references.map((ref, index) => (
                    <div key={index} className="text-sm text-blue-600 underline cursor-pointer">
                      {ref}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}