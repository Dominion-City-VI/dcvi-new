// import { validate as isValidUUID } from 'uuid';
// import { IconDownload, IconPlus } from '@tabler/icons-react';
// import { Button } from '@/components/ui/button';
// import { observer } from 'mobx-react-lite';
// import { useStore } from '@/store';
// import { useLocation } from '@tanstack/react-router';
// import { AppModals } from '@/store/AppConfig/appModalTypes';
// import { useMemo } from 'react';

// function CellMembersButtons() {
//   const pathList = useLocation({
//     select: (location) => location.pathname.split('/')
//   });
//   const {
//     AppConfigStore: { toggleModals }
//   } = useStore();

  
//   const { cellId } = useMemo(() => {
//     const pathLength = pathList.length;
//     const cellId = pathList[pathLength - 1];
//     const areIdsValid = isValidUUID(cellId);
//     return {
//       cellId: areIdsValid ? cellId : '',
//     };

    
//   }, [pathList]);

//   const handleImportClick = () => {
//     toggleModals({
//       name: AppModals.IMPORT_MEMBER_MODAL,
//       open: true,
//       cellId,
//       zonalId:''
//     });
//   };

//   const handleAddClick = () => {
//     toggleModals({
//       name: AppModals.CREATE_MEMBER_MODAL,
//       open: true,
//       cellId,
//       zonalId:''
//     });
//   };

//   return (
//     <div className="flex gap-2">
//       <Button onClick={handleImportClick} variant="outline" className="space-x-1">
//         Import <IconDownload size={18} />
//       </Button>
//       <Button onClick={handleAddClick} className="space-x-1">
//         <span>Add</span> <IconPlus size={18} />
//       </Button>
//     </div>
//   );
// }

// export default observer(CellMembersButtons);



import { validate as isValidUUID } from 'uuid';
import { IconDownload, IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
import { useLocation } from '@tanstack/react-router';
import { AppModals } from '@/store/AppConfig/appModalTypes';
import { useMemo, useEffect, useState } from 'react';
import { useFetchCells } from '@/hooks/cell/useFetchCell';

function CellMembersButtons() {
  const pathList = useLocation({
    select: (location) => location.pathname.split('/')
  });
  const {
    AppConfigStore: { toggleModals }
  } = useStore();

  const [zonalId, setZonalId] = useState<string>('');

  const { cellId } = useMemo(() => {
    const pathLength = pathList.length;
    const cellId = pathList[pathLength - 1];
    const areIdsValid = isValidUUID(cellId);
    return {
      cellId: areIdsValid ? cellId : '',
    };
  }, [pathList]);

  // Fetch cells to find the zoneId
  const { data: cellsData, status: cellsStatus } = useFetchCells(
    { },
    Boolean(cellId)
  );

  // Find the cell and extract zoneId
  useEffect(() => {
    if (cellsStatus === 'success' && cellsData !== undefined && cellId) {
      const foundCell = cellsData.items.find((item: { id: string; zoneId: string }) => item.id === cellId);
      if (foundCell?.zoneId) {
       
        setZonalId(foundCell.zoneId);
      }
    }
  }, [cellsData, cellsStatus, cellId]);

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