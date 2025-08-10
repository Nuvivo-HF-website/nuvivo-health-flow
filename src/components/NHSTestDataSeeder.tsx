import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Database, FileText, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { useToast } from '@/hooks/use-toast';

export function NHSTestDataSeeder() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingStatus, setSeedingStatus] = useState<string[]>([]);

  const nhsTestData = [
    {
      test_name: "Full Blood Count with Differential",
      test_type: "haematology",
      test_date: "2024-01-15",
      result_status: "abnormal",
      result_values: {
        "Haemoglobin": { value: 10.2, unit: "g/dL", reference: "12.0-15.5" },
        "White Cell Count": { value: 12.8, unit: "×10⁹/L", reference: "4.0-11.0" },
        "Platelets": { value: 450, unit: "×10⁹/L", reference: "150-400" }
      },
      doctor_notes: "Mild anaemia with elevated WCC. Recommend iron studies and clinical correlation.",
      clinic_name: "NHS Foundation Trust",
      doctor_name: "Dr. Sarah Johnson"
    },
    {
      test_name: "Lipid Profile",
      test_type: "biochemistry",
      test_date: "2024-01-10",
      result_status: "borderline",
      result_values: {
        "Total Cholesterol": { value: 5.8, unit: "mmol/L", reference: "<5.0" },
        "HDL Cholesterol": { value: 1.1, unit: "mmol/L", reference: ">1.0" },
        "LDL Cholesterol": { value: 3.9, unit: "mmol/L", reference: "<3.0" },
        "Triglycerides": { value: 2.1, unit: "mmol/L", reference: "<1.7" }
      },
      doctor_notes: "Borderline dyslipidaemia. Lifestyle modifications recommended. Repeat in 3 months.",
      clinic_name: "NHS Community Health Centre",
      doctor_name: "Dr. Michael Chen"
    },
    {
      test_name: "Thyroid Function Tests",
      test_type: "endocrinology",
      test_date: "2024-01-08",
      result_status: "normal",
      result_values: {
        "TSH": { value: 2.1, unit: "mU/L", reference: "0.5-4.0" },
        "Free T4": { value: 14.2, unit: "pmol/L", reference: "10.0-22.0" },
        "Free T3": { value: 4.8, unit: "pmol/L", reference: "3.5-6.5" }
      },
      doctor_notes: "Thyroid function within normal limits. No further action required.",
      clinic_name: "NHS Endocrine Centre",
      doctor_name: "Dr. Emma Williams"
    }
  ];

  const seedTestData = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to seed test data",
        variant: "destructive",
      });
      return;
    }

    setIsSeeding(true);
    setSeedingStatus([]);

    try {
      setSeedingStatus(prev => [...prev, "Starting NHS test data seeding..."]);

      for (const testData of nhsTestData) {
        const { data, error } = await supabase
          .from('test_results')
          .insert({
            user_id: user.id,
            ...testData,
            reference_ranges: testData.result_values,
            flagged_values: testData.result_status !== 'normal' ? [
              { test: testData.test_name, flag: testData.result_status }
            ] : []
          });

        if (error) {
          console.error('Error seeding test data:', error);
          setSeedingStatus(prev => [...prev, `❌ Failed to seed ${testData.test_name}`]);
        } else {
          setSeedingStatus(prev => [...prev, `✅ Seeded ${testData.test_name}`]);
        }

        // Add small delay between insertions
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setSeedingStatus(prev => [...prev, "🎉 NHS test data seeding completed!"]);

      toast({
        title: "Test Data Seeded",
        description: "NHS-style test results have been created for demonstration",
      });

    } catch (error) {
      console.error('Error seeding data:', error);
      toast({
        title: "Seeding Failed",
        description: "Failed to seed test data",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              NHS Test Data Seeder
            </CardTitle>
            <CardDescription>
              Generate realistic NHS-style blood test results for AI demo
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Staging Only
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription>
            This will create 3 NHS-style test results with varied diagnoses:
            <br />• Abnormal: Full Blood Count (anaemia, elevated WCC)
            <br />• Borderline: Lipid Profile (dyslipidaemia)
            <br />• Normal: Thyroid Function Tests
          </AlertDescription>
        </Alert>

        <div className="flex items-center gap-4">
          <Button 
            onClick={seedTestData} 
            disabled={isSeeding}
            className="flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            {isSeeding ? 'Seeding Data...' : 'Seed NHS Test Data'}
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {nhsTestData.length} test results will be created
          </div>
        </div>

        {seedingStatus.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Seeding Progress:</h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              {seedingStatus.map((status, index) => (
                <div key={index} className="text-sm font-mono">
                  {status}
                </div>
              ))}
            </div>
          </div>
        )}

        {seedingStatus.some(s => s.includes('completed')) && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              NHS test data successfully seeded! You can now test AI features with realistic medical data.
              Visit the Stakeholder Dashboard to generate AI summaries.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}