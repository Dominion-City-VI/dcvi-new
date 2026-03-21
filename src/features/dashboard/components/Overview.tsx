import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

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

interface IOverviewProps {
  period: string;
  periodicAnalysis: Array<TPeriodicAnalysisDatapointItem>;
  title?: string;
}

const Overview = ({ period, periodicAnalysis, title = 'Attendance Overview' }: IOverviewProps) => {
  const currentYear = new Date().getFullYear();

  const getPeriodDescription = () => {
    if (period === 'WEEK') return 'Tuesday – Monday';
    if (period === 'MONTH') return `January – December ${currentYear}`;
    return `${currentYear}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{getPeriodDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="h-[450px] w-full">
        {periodicAnalysis.length === 0 ? (
          <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
            No data available for this period
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart accessibilityLayer data={periodicAnalysis}>
              <CartesianGrid vertical={false} />
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
                tickFormatter={(value) => String(value)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="cellCount" fill="var(--color-cellCount)" radius={4} />
              <Bar dataKey="sundayServiceCount" fill="var(--color-sundayServiceCount)" radius={4} />
              <Bar
                dataKey="tuesdayServiceCount"
                fill="var(--color-tuesdayServiceCount)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default Overview;
