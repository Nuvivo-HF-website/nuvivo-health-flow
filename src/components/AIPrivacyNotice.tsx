import React from 'react'
import { Shield, Lock, Eye, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const AIPrivacyNotice = () => {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          AI-Powered Health Insights - Privacy Information
        </CardTitle>
        <CardDescription>
          How we protect your privacy when generating AI summaries
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-900">Data Anonymization</h4>
              <p className="text-sm text-muted-foreground">
                Only clinical test values (test names, values, units, and reference ranges) are sent to AI systems. 
                Your name, date of birth, NHS number, and other identifying information are never shared.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">EU-Based Processing</h4>
              <p className="text-sm text-muted-foreground">
                All AI processing is performed using EU-based servers to ensure GDPR compliance and 
                your data doesn't leave the European Union.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Trash2 className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-purple-900">No Data Retention</h4>
              <p className="text-sm text-muted-foreground">
                The AI service doesn't store or retain your test data. Information is processed 
                in real-time and immediately discarded after generating your summary.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Your Rights</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• You can withdraw AI consent at any time in your profile settings</li>
            <li>• Previously generated summaries will remain in your account but no new ones will be created</li>
            <li>• You can request deletion of all AI-generated summaries by contacting support</li>
            <li>• You have the right to access audit logs of AI processing for your account</li>
          </ul>
        </div>

        <div className="text-xs text-muted-foreground p-3 bg-muted rounded">
          <strong>Legal Basis:</strong> AI processing is performed under your explicit consent (GDPR Art. 6(1)(a)) 
          and for health-related purposes (GDPR Art. 9(2)(h)). This notice is part of our broader Privacy Policy 
          and Terms of Service.
        </div>
      </CardContent>
    </Card>
  )
}

export default AIPrivacyNotice