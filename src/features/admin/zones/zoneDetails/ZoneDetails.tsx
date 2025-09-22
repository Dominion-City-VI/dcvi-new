import { toTitleCase } from '@/utils';
import { zoneStatusCallTypes } from '../../../zone/cells/components/data/data';
import { getZoneStatusText } from '@/utils/zones';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { dateTimeUTC } from '@/utils/date';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CellsInZonesTable from '../../../zone/cells/components/CellsInZonesTable';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store';
import { AppModals } from '@/store/AppConfig/appModalTypes';

interface IZoneDetailsProps {
  data: TSingleZoneRes;
}

const ZoneDetails = ({ data }: IZoneDetailsProps) => {
  const {
    AppConfigStore: { toggleModals }
  } = useStore();
  const badgeColor = zoneStatusCallTypes.get(data.zoneStatus);
  return (
    <div className="flex w-full flex-col space-y-4">
      <div className="flex w-full flex-col space-y-1">
        <p className="text-muted-foreground">updated at: {dateTimeUTC(data.updatedAt)}</p>
        <div className="flex items-center justify-start space-x-2">
          <p className="text-muted-foreground">Zonal Status:</p>
          <Badge variant="outline" className={cn('capitalize', badgeColor)}>
            {toTitleCase(getZoneStatusText(data.zoneStatus))}
          </Badge>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => toggleModals({ name: AppModals.CREATE_CELL, open: true, id: data.id })}
        >
          Add New Cell
        </Button>
      </div>
      <div className="flex flex-col divide-y">
        <div className="flex w-full flex-col space-y-1">
          <p>Zone Leader</p>
          <Card className="w-fit rounded-lg !border-none p-1 shadow-none">
            <CardHeader className="p-2">
              <CardTitle>{data?.zonalLeader?.name ?? ''}</CardTitle>
              <CardDescription>{data?.zonalLeader?.email ?? ''}</CardDescription>
              <CardDescription>{data?.zonalLeader?.phoneNumber ?? ''}</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="flex flex-col pt-2">
          <CellsInZonesTable {...{ placeholder: 'search cells...', data: data.cells }} />
        </div>
      </div>
    </div>
  );
};

export default ZoneDetails;
