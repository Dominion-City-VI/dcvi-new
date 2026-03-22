import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ServiceRow {
  label: string;
  pct: number;
  present?: number;
  total?: number;
  color: string;
}

interface AttendanceServiceCardProps {
  title: string;
  description?: string;
  services: ServiceRow[];
}

function pctColor(v: number) {
  return v >= 75 ? 'text-green-600' : v >= 50 ? 'text-yellow-600' : 'text-red-600';
}

export const AttendanceServiceCard = ({
  title,
  description,
  services
}: AttendanceServiceCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-5 pt-2">
        {services.map((s) => (
          <div key={s.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{s.label}</span>
              <span className={cn('font-bold', pctColor(s.pct))}>{s.pct.toFixed(1)}%</span>
            </div>
            <div className="bg-muted h-2 w-full rounded-full">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${s.color}`}
                style={{ width: `${Math.min(Math.max(s.pct, 0), 100)}%` }}
              />
            </div>
            {s.present !== undefined && s.total !== undefined && s.total > 0 && (
              <p className="text-xs text-muted-foreground">
                {s.present.toLocaleString()} present / {s.total.toLocaleString()} records
              </p>
            )}
          </div>
        ))}
        {services.every((s) => s.pct === 0) && (
          <p className="text-muted-foreground text-center text-sm py-4">No data for this period</p>
        )}
      </CardContent>
    </Card>
  );
};
