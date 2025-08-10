import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, User, Link as LinkIcon, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function StagingUserSetup() {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [testUserCreated, setTestUserCreated] = useState(false);
  const [testUserId, setTestUserId] = useState<string | null>(null);
  const [loginUrl, setLoginUrl] = useState<string>('');

  const testUserData = {
    email: 'test.patient@example.com',
    password: 'TestPass123!',
    name: 'John Test'
  };

  const bloodTestData = {
    report_id: "BT-TEST-001",
    date: "2025-07-20",
    type: "Full Blood Count",
    results: {
      "Hemoglobin": "14.2 g/dL",
      "WBC": "6.1 x10^9/L", 
      "Platelets": "250 x10^9/L",
      "CRP": "3 mg/L"
    }
  };

  const createTestUser = async () => {
    setIsCreating(true);
    
    try {
      // Step 1: Create test user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testUserData.email,
        password: testUserData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: testUserData.name
          }
        }
      });

      if (authError) {
        // If user already exists, try to sign in to get the user ID
        if (authError.message.includes('already registered')) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: testUserData.email,
            password: testUserData.password
          });
          
          if (signInError) throw signInError;
          setTestUserId(signInData.user?.id || null);
        } else {
          throw authError;
        }
      } else {
        setTestUserId(authData.user?.id || null);
      }

      // Step 2: Ensure profile exists with AI consent enabled
      const userId = authData?.user?.id || testUserId;
      if (userId) {
        await supabase
          .from('profiles')
          .upsert({
            user_id: userId,
            email: testUserData.email,
            full_name: testUserData.name,
            ai_consent: true,
            user_type: 'patient'
          });

        // Step 3: Add patient role
        await supabase
          .from('user_roles')
          .upsert({
            user_id: userId,
            role: 'patient'
          });

        // Step 4: Create blood test result
        const { data: resultData, error: resultError } = await supabase
          .from('results')
          .insert({
            user_id: userId,
            parsed_data: {
              test_date: bloodTestData.date,
              test_type: bloodTestData.type,
              report_id: bloodTestData.report_id,
              tests: [
                {
                  test_name: "Hemoglobin",
                  value: "14.2",
                  unit: "g/dL",
                  reference_range: "12.0-15.5",
                  status: "normal"
                },
                {
                  test_name: "White Cell Count (WBC)",
                  value: "6.1",
                  unit: "x10^9/L", 
                  reference_range: "4.0-11.0",
                  status: "normal"
                },
                {
                  test_name: "Platelets",
                  value: "250",
                  unit: "x10^9/L",
                  reference_range: "150-400",
                  status: "normal"
                },
                {
                  test_name: "C-Reactive Protein (CRP)",
                  value: "3",
                  unit: "mg/L",
                  reference_range: "<5",
                  status: "normal"
                }
              ],
              laboratory: "NHS Test Laboratory",
              patient_info: {
                name: testUserData.name,
                report_id: bloodTestData.report_id
              }
            },
            uploaded_by: userId
          })
          .select()
          .single();

        if (resultError) {
          console.error('Error creating test result:', resultError);
        } else {
          // Step 5: Trigger AI summary generation
          try {
            const { error: aiError } = await supabase.functions.invoke('generate-summary', {
              body: { 
                resultId: resultData.id,
                testMode: true
              }
            });
            
            if (aiError) {
              console.warn('AI summary generation failed:', aiError);
            }
          } catch (aiError) {
            console.warn('AI summary generation error:', aiError);
          }
        }

        // Generate login URL for preview
        const previewUrl = `${window.location.origin}/my-test-results`;
        setLoginUrl(previewUrl);
        setTestUserCreated(true);

        // Sign out the test user to allow manual login
        await supabase.auth.signOut();

        toast({
          title: "Test User Created Successfully",
          description: `Test patient account created with blood test data and AI processing enabled.`,
        });
      }

    } catch (error) {
      console.error('Error creating test user:', error);
      toast({
        title: "Error Creating Test User",
        description: error instanceof Error ? error.message : "Failed to create test user",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Text copied successfully",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Staging Test User Setup
            </CardTitle>
            <CardDescription>
              Create test patient account with sample blood test data for AI demo
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!testUserCreated ? (
          <>
            <Alert>
              <User className="h-4 w-4" />
              <AlertDescription>
                This will create a test patient account with the following data:
                <br />• Email: {testUserData.email}
                <br />• Password: {testUserData.password}
                <br />• Full Blood Count report with normal values
                <br />• AI consent enabled for processing
              </AlertDescription>
            </Alert>

            <Button 
              onClick={createTestUser} 
              disabled={isCreating}
              className="w-full"
            >
              <User className="h-4 w-4 mr-2" />
              {isCreating ? 'Creating Test User...' : 'Create Test Patient Account'}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Test patient account created successfully with sample blood test data!
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold">Test User Login Credentials:</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm"><strong>Email:</strong> {testUserData.email}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(testUserData.email)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm"><strong>Password:</strong> {testUserData.password}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(testUserData.password)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Preview Link:</h3>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    asChild
                    className="flex-1"
                  >
                    <a href={loginUrl} target="_blank" rel="noopener noreferrer">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Open Test Results Page
                    </a>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(loginUrl)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Sign in with the credentials above to view the AI-processed blood test results
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}