import { validate as isValidUUID } from 'uuid';
import { IconDownload, IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
import { useLocation } from '@tanstack/react-router';
import { AppModals } from '@/store/AppConfig/appModalTypes';
import { useMemo } from 'react';

function CellMembersButtons() {
  const pathList = useLocation({
    select: (location) => location.pathname.split('/')
  });
  const {
    AppConfigStore: { toggleModals }
  } = useStore();

  const { cellId, zonalId } = useMemo(() => {
    const pathLength = pathList.length;
    const cellId = pathList[pathLength - 1];
    const zonalId = pathList[pathLength - 2];
    const areIdsValid = isValidUUID(cellId) && isValidUUID(zonalId);

    return {
      cellId: areIdsValid ? cellId : '',
      zonalId: areIdsValid ? zonalId : ''
    };
  }, [pathList]);

  const handleImportClick = () => {
    toggleModals({
      name: AppModals.IMPORT_MEMBER_MODAL,
      open: true,
      cellId,
      zonalId
    });
  };

  const handleAddClick = () => {
    toggleModals({
      name: AppModals.CREATE_MEMBER_MODAL,
      open: true,
      cellId,
      zonalId
    });
  };

  return (
    <div className="flex gap-2">
      <Button onClick={handleImportClick} variant="outline" className="space-x-1">
        Import <IconDownload size={18} />
      </Button>
      <Button onClick={handleAddClick} className="space-x-1">
        <span>Add</span> <IconPlus size={18} />
      </Button>
    </div>
  );
}

export default observer(CellMembersButtons);
