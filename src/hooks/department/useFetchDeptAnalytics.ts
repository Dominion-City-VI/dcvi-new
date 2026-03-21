import { useFetchServiceSummary } from '@/hooks/attendance/useFetchServiceSummary';
import { useFetchStatusSummary } from '@/hooks/attendance/useFetchStatusSummary';
import { EnumRoles } from '@/constants/mangle';

interface UseFetchDeptAnalyticsParams {
  departmentId: string | undefined;
  period: number;
}

export const useFetchDeptAnalytics = ({ departmentId, period }: UseFetchDeptAnalyticsParams) => {
  const enabled = Boolean(departmentId);

  const { data: serviceSummary, isLoading: serviceLoading } = useFetchServiceSummary(
    {
      Period: period,
      RolesUnitAccessType: EnumRoles.DEPARTMENTAL_HEAD,
      Id: departmentId
    },
    enabled
  );

  const { data: statusSummary, isLoading: statusLoading } = useFetchStatusSummary(
    {
      Period: period,
      RolesUnitAccessType: EnumRoles.DEPARTMENTAL_HEAD,
      Id: departmentId
    },
    enabled
  );

  return {
    serviceSummary,
    statusSummary,
    isLoading: serviceLoading || statusLoading
  };
};
