import { 
  Bar, BarChart, CartesianGrid, XAxis, YAxis,
  Line, LineChart, Area, AreaChart,
  Pie, PieChart, Cell, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';

type TPeriodicAnalysisDatapointItem = {
  label: string;
  cellCount: number;
  sundayServiceCount: number;
  tuesdayServiceCount: number;
};

interface IChartProps {
  period: string;
  periodicAnalysis: Array<TPeriodicAnalysisDatapointItem>;
}

const chartConfig = {
  cellCount: {
    label: 'Cell',
    color: '#3399FF'
  },
  sundayServiceCount: {
    label: 'Sunday',
    color: '#F9B115'
  },
  tuesdayServiceCount: {
    label: 'Tuesday',
    color: '#E55353'
  }
} satisfies ChartConfig;

// 1. LINE CHART - Best for trends over time
export const LineChartOverview = ({ period, periodicAnalysis }: IChartProps) => {
  const getPeriodDescription = () => {
    const currentYear = new Date().getFullYear();
    if (period === 'WEEK') return 'Tuesday - Monday';
    if (period === 'MONTH') return `January - December ${currentYear}`;
    return `${currentYear}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Attendance Trends</CardTitle>
        <CardDescription>{getPeriodDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="h-[450px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart accessibilityLayer data={periodicAnalysis}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line 
              type="monotone" 
              dataKey="cellCount" 
              stroke="var(--color-cellCount)" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="sundayServiceCount" 
              stroke="var(--color-sundayServiceCount)" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="tuesdayServiceCount" 
              stroke="var(--color-tuesdayServiceCount)" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

// 2. AREA CHART - Best for showing volume and trends
export const AreaChartOverview = ({ period, periodicAnalysis }: IChartProps) => {
  const getPeriodDescription = () => {
    const currentYear = new Date().getFullYear();
    if (period === 'WEEK') return 'Tuesday - Monday';
    if (period === 'MONTH') return `January - December ${currentYear}`;
    return `${currentYear}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Service Attendance Volume</CardTitle>
        <CardDescription>{getPeriodDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="h-[450px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart accessibilityLayer data={periodicAnalysis}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area 
              type="monotone" 
              dataKey="cellCount" 
              stroke="var(--color-cellCount)" 
              fill="var(--color-cellCount)"
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="sundayServiceCount" 
              stroke="var(--color-sundayServiceCount)" 
              fill="var(--color-sundayServiceCount)"
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="tuesdayServiceCount" 
              stroke="var(--color-tuesdayServiceCount)" 
              fill="var(--color-tuesdayServiceCount)"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

// 3. STACKED AREA CHART - Best for showing composition over time
export const StackedAreaChart = ({ period, periodicAnalysis }: IChartProps) => {
  const getPeriodDescription = () => {
    const currentYear = new Date().getFullYear();
    if (period === 'WEEK') return 'Tuesday - Monday';
    if (period === 'MONTH') return `January - December ${currentYear}`;
    return `${currentYear}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cumulative Attendance</CardTitle>
        <CardDescription>{getPeriodDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="h-[450px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart accessibilityLayer data={periodicAnalysis}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area 
              type="monotone" 
              dataKey="cellCount" 
              stackId="1"
              stroke="var(--color-cellCount)" 
              fill="var(--color-cellCount)"
            />
            <Area 
              type="monotone" 
              dataKey="sundayServiceCount" 
              stackId="1"
              stroke="var(--color-sundayServiceCount)" 
              fill="var(--color-sundayServiceCount)"
            />
            <Area 
              type="monotone" 
              dataKey="tuesdayServiceCount" 
              stackId="1"
              stroke="var(--color-tuesdayServiceCount)" 
              fill="var(--color-tuesdayServiceCount)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

// 4. PIE CHART - Best for showing total distribution
export const PieChartOverview = ({ periodicAnalysis }: { periodicAnalysis: Array<TPeriodicAnalysisDatapointItem> }) => {
  const totalData = periodicAnalysis.reduce(
    (acc, item) => ({
      cellCount: acc.cellCount + item.cellCount,
      sundayServiceCount: acc.sundayServiceCount + item.sundayServiceCount,
      tuesdayServiceCount: acc.tuesdayServiceCount + item.tuesdayServiceCount,
    }),
    { cellCount: 0, sundayServiceCount: 0, tuesdayServiceCount: 0 }
  );

  const pieData = [
    { name: 'Cell', value: totalData.cellCount, color: '#3399FF' },
    { name: 'Sunday', value: totalData.sundayServiceCount, color: '#F9B115' },
    { name: 'Tuesday', value: totalData.tuesdayServiceCount, color: '#E55353' }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Total Attendance Distribution</CardTitle>
        <CardDescription>Overall breakdown by service type</CardDescription>
      </CardHeader>
      <CardContent className="h-[450px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// 5. MIXED CHART - Combination of Bar and Line
export const MixedChartOverview = ({ period, periodicAnalysis }: IChartProps) => {
  const getPeriodDescription = () => {
    const currentYear = new Date().getFullYear();
    if (period === 'WEEK') return 'Tuesday - Monday';
    if (period === 'MONTH') return `January - December ${currentYear}`;
    return `${currentYear}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Service Comparison</CardTitle>
        <CardDescription>{getPeriodDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="h-[450px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={periodicAnalysis}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="sundayServiceCount" fill="var(--color-sundayServiceCount)" radius={4} />
            <Bar dataKey="tuesdayServiceCount" fill="var(--color-tuesdayServiceCount)" radius={4} />
            <Line 
              type="monotone" 
              dataKey="cellCount" 
              stroke="var(--color-cellCount)" 
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

// USAGE EXAMPLE:
// import { LineChartOverview, AreaChartOverview, StackedAreaChart, PieChartOverview, MixedChartOverview } from './AnalyticsCharts';
// 
// <LineChartOverview period={period} periodicAnalysis={periodicAnalysis} />
// <AreaChartOverview period={period} periodicAnalysis={periodicAnalysis} />
// <StackedAreaChart period={period} periodicAnalysis={periodicAnalysis} />
// <PieChartOverview periodicAnalysis={periodicAnalysis} />
// <MixedChartOverview period={period} periodicAnalysis={periodicAnalysis} />