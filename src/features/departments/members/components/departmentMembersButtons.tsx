// import { validate as isValidUUID } from 'uuid';
import { IconDownload, IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
// import { useLocation } from '@tanstack/react-router';
import { AppModals } from '@/store/AppConfig/appModalTypes';
import { useState } from 'react';
// import { useMemo, useState } from 'react';
import { useFetchDepartmentWithMembers } from '@/hooks/department/useFetchDepartment';

function DepartmentMembersButtons() {
  const {
    AuthStore: { userExtraInfo },
    AppConfigStore: { toggleModals }
  } = useStore();

  const [zonalId, setZonalId] = useState<string>('');

  const departmentId =  userExtraInfo.departmentId;

  const { data: dept, status } = useFetchDepartmentWithMembers(userExtraInfo.departmentId, !!userExtraInfo.departmentId);

  const handleImportClick = () => {
    toggleModals({
      name: AppModals.IMPORT_MEMBER_MODAL,
      open: true,
      cellId: '',
      zonalId,
      departmentId
    } as any);
  };

  const handleAddClick = () => {
    toggleModals({
      name: AppModals.DEPARTMENT_ADD_MEMBER,
      open: true,
      cellId: null,
      zonalId: null,
      departmentId
    } as any);
  };

  const disabled = !departmentId || status !== 'success';

  return (
    <div className="flex gap-2">
      <Button onClick={handleImportClick} variant="outline" className="space-x-1" disabled={disabled}>
        Import <IconDownload size={18} />
      </Button>
      <Button onClick={handleAddClick} className="space-x-1" disabled={disabled}>
        <span>Add</span> <IconPlus size={18} />
      </Button>
    </div>
  );
}

export default observer(DepartmentMembersButtons);