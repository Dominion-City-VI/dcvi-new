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
}

const Overview = ({ period, periodicAnalysis }: IOverviewProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Zone overview</CardTitle>
        <CardDescription>
          {period == 'WEEK' && 'Tuesday - Monday'}
          {period == 'MONTH' && 'January - December'} {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[450px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={periodicAnalysis}>
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={(value) => value.slice(0, 5)}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="cellCount" fill="var(--color-cellCount)" radius={4} />
            <Bar dataKey="sundayServiceCount" fill="var(--color-sundayServiceCount)" radius={4} />
            <Bar dataKey="tuesdayServiceCount" fill="var(--color-tuesdayServiceCount)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default Overview;
