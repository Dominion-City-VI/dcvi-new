import { EnumRoles } from '@/constants/mangle';
import CellLeaderDB from './cell/CellLeader';
import ZonalPastorDB from './zone/ZonalPastor';
import AdminDB from './admin';
import DepartmentDB from './department/DepartmentDB';

interface IRenderDashboardProps {
  role: number;
}

const DynamicDB = ({ role }: IRenderDashboardProps) => {
  const renderDB = () => {
    switch (role) {
      case EnumRoles.SUPER_ADMIN:
      case EnumRoles.SUB_ADMIN:
      case EnumRoles.SENIOR_PASTOR:
      case EnumRoles.PASTOR:
      case EnumRoles.DISTRICT_PASTOR:
        return <AdminDB />;

      case EnumRoles.ZONAL_PASTOR:
        return <ZonalPastorDB />;

      case EnumRoles.CELL_LEADER:
      case EnumRoles.ASST_CELL_LEADER:
        return <CellLeaderDB />;

      case EnumRoles.DEPARTMENTAL_HEAD:
      case EnumRoles.ASST_DEPARTMENTAL_HEAD:
        return <DepartmentDB />;

      default:
        return <AdminDB />;
    }
  };

  return <div className="flex flex-col space-y-6">{renderDB()}</div>;
};

export default DynamicDB;
