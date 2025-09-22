import { EnumRoles } from '@/constants/mangle';
import CellLeaderDB from './cell/CellLeader';
import ZonalPastorDB from './zone/ZonalPastor';
import AdminDB from './admin';

interface IRenderDashboardProps {
  role: number;
}

const DynamicDB = ({ role }: IRenderDashboardProps) => {
  const renderDB = () => {
    switch (role) {
      case EnumRoles.CELL_LEADER:
        return <CellLeaderDB />;
      case EnumRoles.ZONAL_PASTOR:
        return <ZonalPastorDB />;
      default:
        return <AdminDB />;
    }
  };
  return <div className="flex flex-col space-y-6">{renderDB()}</div>;
};

export default DynamicDB;
