import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  TrendingUp,
  Calendar,
  MessageCircle,
  FileText,
  BarChart3,
  Activity,
  Brain,
  Video,
  Stethoscope,
  Pill,
  Target,
  Shield,
  Zap,
  Dna,
  Settings
} from 'lucide-react';

interface PortalSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuSections = [
  {
    title: 'ESSENTIALS',
    items: [
      { id: 'overview', label: 'Overview', icon: TrendingUp },
      { id: 'appointments', label: 'Appointments', icon: Calendar },
      { id: 'messages', label: 'Messages', icon: MessageCircle },
      { id: 'records', label: 'Records', icon: FileText },
    ]
  },
  {
    title: 'HEALTH INSIGHTS',
    items: [
      { id: 'health-trends', label: 'Health Trends', icon: BarChart3 },
      { id: 'health-metrics', label: 'Health Metrics', icon: Activity },
      { id: 'ai-assistant', label: 'AI Assistant', icon: Brain },
      { id: 'predictive-analytics', label: 'Predictive Analytics', icon: TrendingUp },
    ]
  },
  {
    title: 'CARE',
    items: [
      { id: 'telemedicine', label: 'Telemedicine', icon: Video },
      { id: 'clinical-support', label: 'Clinical Support', icon: Stethoscope },
      { id: 'prescriptions', label: 'Medications', icon: Pill },
      { id: 'goals', label: 'Goals', icon: Target },
    ]
  },
  {
    title: 'DATA & PRIVACY',
    items: [
      { id: 'privacy', label: 'Privacy', icon: Shield },
      { id: 'automations', label: 'Automations', icon: Zap },
      { id: 'genomics', label: 'Genomics', icon: Dna },
    ]
  },
  {
    title: 'SAFETY',
    items: [
      { id: 'safety', label: 'Emergency & Safety', icon: Shield },
    ]
  }
];

export function PortalSidebar({ activeSection, onSectionChange }: PortalSidebarProps) {
  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          {menuSections.map((section) => (
            <div key={section.title} className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeSection === item.id ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-2 h-10",
                        activeSection === item.id && "bg-secondary text-secondary-foreground"
                      )}
                      onClick={() => onSectionChange(item.id)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}