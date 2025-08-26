import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Shield,
  Calendar,
  Activity,
  Brain
} from 'lucide-react';

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  const actions = [
    {
      id: 'safety',
      title: 'Need Help?',
      subtitle: 'Emergency support',
      icon: Shield,
      color: 'text-red-500'
    },
    {
      id: 'appointments',
      title: 'Book Appointment',
      subtitle: 'Schedule with specialists',
      icon: Calendar,
      color: 'text-blue-500'
    },
    {
      id: 'health-metrics',
      title: 'Track Health',
      subtitle: 'Monitor vital signs',
      icon: Activity,
      color: 'text-green-500'
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      subtitle: 'Get health insights',
      icon: Brain,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Card 
            key={action.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onActionClick(action.id)}
          >
            <CardContent className="flex flex-col items-center p-6 text-center">
              <Icon className={`h-8 w-8 ${action.color} mb-3`} />
              <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
              <p className="text-xs text-muted-foreground">{action.subtitle}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}