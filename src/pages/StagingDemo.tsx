import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Terminal, Shield, Brain, Database } from 'lucide-react';
import { StagingTestRunner } from '@/components/StagingTestRunner';
import { NHSTestDataSeeder } from '@/components/NHSTestDataSeeder';
import { AIConsent } from '@/components/AIConsent';

export default function StagingDemo() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staging Environment Demo</h1>
          <p className="text-muted-foreground">
            GDPR compliance testing and AI features demonstration
          </p>
        </div>
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          Staging Environment
        </Badge>
      </div>

      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertDescription>
          <strong>Setup Instructions:</strong> Run the following commands to initialize staging environment:
          <br />
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">chmod +x scripts/staging-setup.sh && ./scripts/staging-setup.sh</code>
          <br />
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">npm run staging:full</code>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="setup" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">Environment Setup</TabsTrigger>
          <TabsTrigger value="ai-demo">AI Features Demo</TabsTrigger>
          <TabsTrigger value="compliance">GDPR Compliance</TabsTrigger>
          <TabsTrigger value="testing">Test Suite</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Environment Configuration
                </CardTitle>
                <CardDescription>
                  Staging environment setup and configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Required Environment Variables:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• STAGING_SUPABASE_URL</li>
                    <li>• STAGING_SUPABASE_ANON_KEY</li>
                    <li>• AZURE_OPENAI_ENDPOINT</li>
                    <li>• AZURE_OPENAI_API_KEY</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Setup Steps:</h4>
                  <ol className="text-sm text-muted-foreground space-y-1">
                    <li>1. Configure staging Supabase project (EU region)</li>
                    <li>2. Run staging-setup.sh script</li>
                    <li>3. Execute staging-seed-data.sql</li>
                    <li>4. Run compliance test suite</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <NHSTestDataSeeder />
          </div>
        </TabsContent>

        <TabsContent value="ai-demo" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <AIConsent />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Features Overview
                </CardTitle>
                <CardDescription>
                  NHS-compliant AI features demonstration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Azure OpenAI</Badge>
                    <span className="text-sm">EU-compliant AI processing</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">NHS Standards</Badge>
                    <span className="text-sm">Healthcare data compliance</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">GDPR</Badge>
                    <span className="text-sm">Full consent management</span>
                  </div>
                </div>

                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertDescription>
                    AI features require explicit user consent and use anonymized data processing.
                    All AI interpretations include NHS-compliant disclaimers.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                GDPR Compliance Features
              </CardTitle>
              <CardDescription>
                Data protection and privacy compliance validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium">Data Protection</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✅ Data encryption at rest and in transit</li>
                    <li>✅ Anonymization for AI processing</li>
                    <li>✅ Secure data storage in EU region</li>
                    <li>✅ Regular security audits</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">User Rights</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✅ Explicit consent collection</li>
                    <li>✅ Data portability (export)</li>
                    <li>✅ Right to erasure</li>
                    <li>✅ Consent withdrawal</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <StagingTestRunner />
        </TabsContent>
      </Tabs>
    </div>
  );
}