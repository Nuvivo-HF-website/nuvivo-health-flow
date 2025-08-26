import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AnalyticsOverview() {
  const metrics = [
    {
      title: 'Resting HR',
      value: '80',
      change: '+2% this week',
      color: 'text-green-500'
    },
    {
      title: 'Steps',
      value: '76',
      change: '+2% this week',
      color: 'text-green-500'
    },
    {
      title: 'Sleep',
      value: '73',
      change: '+5% this week',
      color: 'text-green-500'
    },
    {
      title: 'Stress',
      value: '91',
      change: '+2% this week',
      color: 'text-green-500'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <div key={metric.title} className="space-y-2">
              <p className="text-sm text-muted-foreground">{metric.title}</p>
              <p className="text-3xl font-bold">{metric.value}</p>
              <p className={`text-xs ${metric.color}`}>{metric.change}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}