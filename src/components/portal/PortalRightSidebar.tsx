import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar,
  MessageCircle,
  Eye,
  Shield,
  Check,
  X,
  Settings
} from 'lucide-react';

export function PortalRightSidebar() {
  return (
    <div className="w-80 bg-card border-l border-border p-6 space-y-6">
      {/* Next Appointment */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Next Appointment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <p className="font-medium">Tue, 2 Sep • 10:30 — Dr. Patel</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              Reschedule
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Results */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Results</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">
              View all
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Vitamin D</span>
            <span className="text-sm font-medium">18 ng/mL</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Cholesterol</span>
            <span className="text-sm font-medium">180 mg/dL</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">HbA1c</span>
            <span className="text-sm font-medium">5.2%</span>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Messages */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Messages
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">2 unread from Care Team</p>
            <Button variant="outline" size="sm" className="w-full">
              Open inbox
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Privacy Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Consent: Wearables</span>
              <Check className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">AI Summaries</span>
              <Check className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Marketing</span>
              <X className="h-4 w-4 text-red-500" />
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            Manage consent
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}