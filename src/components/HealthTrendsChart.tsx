import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

interface NormalizedTestResult {
  test_name: string;
  value: number;
  unit: string;
  reference_min: number;
  reference_max: number;
  date: string;
  result_id: string;
}

interface HealthTrendsChartProps {
  testName: string;
  results: NormalizedTestResult[];
  className?: string;
}

interface ChartDataPoint {
  date: string;
  value: number;
  reference_min: number;
  reference_max: number;
  unit: string;
  status: 'normal' | 'borderline' | 'abnormal';
  formattedDate: string;
}

const getValueStatus = (value: number, min: number, max: number): 'normal' | 'borderline' | 'abnormal' => {
  const range = max - min;
  const borderlineMargin = range * 0.1; // 10% margin for borderline
  
  if (value >= (min - borderlineMargin) && value <= (max + borderlineMargin)) {
    if (value >= min && value <= max) {
      return 'normal';
    }
    return 'borderline';
  }
  
  return 'abnormal';
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataPoint;
    return (
      <div 
        className="bg-background border border-border rounded-lg p-3 shadow-lg"
        role="tooltip"
        aria-label={`Test result tooltip for ${data.formattedDate}`}
      >
        <p className="font-medium text-foreground">{payload[0].dataKey}</p>
        <p className="text-sm text-muted-foreground">{data.formattedDate}</p>
        <p className="text-sm">
          <span className="font-medium">Value:</span> {data.value} {data.unit}
        </p>
        <p className="text-sm">
          <span className="font-medium">Reference:</span> {data.reference_min}-{data.reference_max} {data.unit}
        </p>
        <Badge 
          variant={
            data.status === 'normal' ? 'secondary' :
            data.status === 'borderline' ? 'default' : 'destructive'
          }
          className="mt-1 text-xs"
        >
          {data.status === 'normal' ? 'Normal' :
           data.status === 'borderline' ? 'Borderline' : 'Outside Range'}
        </Badge>
      </div>
    );
  }
  return null;
};

export const HealthTrendsChart: React.FC<HealthTrendsChartProps> = ({
  testName,
  results,
  className = ''
}) => {
  const chartData = useMemo((): ChartDataPoint[] => {
    return results
      .filter(result => result.test_name === testName)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(result => {
        const status = getValueStatus(result.value, result.reference_min, result.reference_max);
        return {
          date: result.date,
          value: result.value,
          reference_min: result.reference_min,
          reference_max: result.reference_max,
          unit: result.unit,
          status,
          formattedDate: format(parseISO(result.date), 'MMM dd, yyyy')
        };
      });
  }, [testName, results]);

  if (chartData.length === 0) {
    return null;
  }

  const latestResult = chartData[chartData.length - 1];
  const hasMultipleResults = chartData.length > 1;

  // Calculate Y-axis domain with some padding
  const values = chartData.map(d => d.value);
  const minValue = Math.min(...values, latestResult.reference_min);
  const maxValue = Math.max(...values, latestResult.reference_max);
  const range = maxValue - minValue;
  const padding = range * 0.1;
  const yAxisMin = Math.max(0, minValue - padding);
  const yAxisMax = maxValue + padding;

  return (
    <Card className={`${className} transition-all duration-200 hover:shadow-md`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            {testName}
          </CardTitle>
          <Badge 
            variant={
              latestResult.status === 'normal' ? 'secondary' :
              latestResult.status === 'borderline' ? 'default' : 'destructive'
            }
            className="text-xs"
          >
            Latest: {latestResult.status === 'normal' ? 'Normal' :
                     latestResult.status === 'borderline' ? 'Borderline' : 'Outside Range'}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Latest: {latestResult.value} {latestResult.unit} 
          <span className="mx-2">•</span>
          Reference: {latestResult.reference_min}-{latestResult.reference_max} {latestResult.unit}
        </div>
      </CardHeader>
      
      <CardContent>
        <div 
          className="w-full h-64"
          role="img"
          aria-label={`Line chart showing ${testName} values over time. Latest value is ${latestResult.value} ${latestResult.unit}, which is ${latestResult.status}.`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <defs>
                {/* Green zone (normal range) */}
                <linearGradient id="normalZone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0.05} />
                </linearGradient>
                
                {/* Yellow zones (borderline) */}
                <linearGradient id="borderlineZone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--warning))" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="hsl(var(--warning))" stopOpacity={0.05} />
                </linearGradient>
                
                {/* Red zones (abnormal) */}
                <linearGradient id="abnormalZone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))"
                strokeOpacity={0.3}
              />
              
              <XAxis 
                dataKey="formattedDate"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              
              <YAxis 
                domain={[yAxisMin, yAxisMax]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                label={{ 
                  value: latestResult.unit, 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' }
                }}
              />
              
              {/* Reference range lines */}
              <ReferenceLine 
                y={latestResult.reference_min} 
                stroke="hsl(var(--success))"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{ 
                  value: "Min", 
                  position: "insideTopRight",
                  style: { fill: 'hsl(var(--success))' }
                }}
              />
              <ReferenceLine 
                y={latestResult.reference_max} 
                stroke="hsl(var(--success))"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{ 
                  value: "Max", 
                  position: "insideBottomRight",
                  style: { fill: 'hsl(var(--success))' }
                }}
              />
              
              {/* Normal range area */}
              <Area
                type="monotone"
                dataKey={() => latestResult.reference_max}
                fill="url(#normalZone)"
                stroke="none"
                isAnimationActive={false}
              />
              
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ strokeDasharray: '3 3', stroke: 'hsl(var(--muted-foreground))' }}
              />
              
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ 
                  fill: 'hsl(var(--primary))', 
                  strokeWidth: 2, 
                  r: hasMultipleResults ? 4 : 6 
                }}
                activeDot={{ 
                  r: 6, 
                  stroke: 'hsl(var(--primary))',
                  strokeWidth: 2,
                  fill: 'hsl(var(--background))'
                }}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Accessibility information */}
        <div className="sr-only" aria-live="polite">
          Chart for {testName}. 
          {hasMultipleResults 
            ? `Shows ${chartData.length} results over time. ` 
            : 'Shows 1 result. '
          }
          Latest value is {latestResult.value} {latestResult.unit}, 
          reference range is {latestResult.reference_min} to {latestResult.reference_max} {latestResult.unit}.
          Status: {latestResult.status}.
        </div>
        
        {/* Visual legend */}
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-success/20 border border-success/40 rounded"></div>
            <span>Normal Range</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-warning/20 border border-warning/40 rounded"></div>
            <span>Borderline</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-destructive/20 border border-destructive/40 rounded"></div>
            <span>Outside Range</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};