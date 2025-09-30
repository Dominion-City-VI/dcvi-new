'use client';
import { useStore } from '@/store';
import { AppModals } from '@/store/AppConfig/appModalTypes';
import { observer } from 'mobx-react-lite';
import { lazy, useMemo } from 'react';

const ModalsMap = {
  [AppModals.DONE]: lazy(() => import('@/components/modals/DoneModal')),
  [AppModals.LOG_OUT_MODAL]: lazy(() => import('@/components/modals/LogoutModal')),
  [AppModals.IMPORT_PHONEBOOK]: lazy(
    () => import('@/features/messaging/phoneBook/components/ImportModal')
  ),
  [AppModals.IMPORT_MEMBER_MODAL]: lazy(
    () => import('@/features/cells/members/components/modals/ImportMemberModal')
  ),
  [AppModals.DELETE_PHONEBOOK_MODAL]: lazy(
    () => import('@/features/messaging/phoneBook/components/DeletePBModal')
  ),
  [AppModals.DELETE_CONTACT_MODAL]: lazy(
    () => import('@/features/messaging/phoneBook/components/DeleteContactModal')
  ),
  [AppModals.ADD_CONTACT_MODAL]: lazy(
    () => import('@/features/messaging/phoneBook/phonebookId/components/AddContactModal')
  ),
  [AppModals.CREATE_MEMBER_MODAL]: lazy(
    () => import('@/features/cells/members/components/modals/CreateMemberModal')
  ),
  [AppModals.VIEW_MEMBER_MODAL]: lazy(
    () => import('@/features/cells/members/components/modals/ViewMemberModal')
  ),
  [AppModals.DELETE_MEMBER_MODAL]: lazy(
    () => import('@/features/cells/members/components/modals/DeleteMemberModal')
  ),
  [AppModals.MARK_ATTENDANCE_MODAL]: lazy(
    () => import('@/features/cells/attendance/components/modal/MarkAttendance')
  ),
  [AppModals.SEND_SMS_MODAL]: lazy(
    () => import('@/features/messaging/sms/components/modals/SendSMSModal')
  ),
  [AppModals.FUND_WALLET_MODAL]: lazy(
    () => import('@/features/wallet/components/modal/WalletTopupModal')
  ),
  [AppModals.DELETE_CELL_MODAL]: lazy(
    () => import('@/features/zone/cells/components/modals/DeleteZoneModal')
  ),
  [AppModals.UPDATE_ROLE_MODAL]: lazy(
    () => import('@/features/admin/users/components/modals/UpdateRoleModal')
  ),
  [AppModals.REVOKE_ROLE_MODAL]: lazy(
    () => import('@/features/admin/users/components/modals/RevokeRoleModal')
  ),
  [AppModals.ACCESS_REQUEST_MODAL]: lazy(
    () => import('@/features/admin/requests/access/components/modal/AccessModal')
  ),
   [AppModals.ADMIN_ACCESS_REQUEST_MODAL]: lazy(
    () => import('@/features/admin/requests/access/components/modal/UserAccessModal')
  ),
  [AppModals.ACTION_REQUEST_MODAL]: lazy(
    () => import('@/features/admin/requests/actions/components/modal/ActionModal')
  ),
  [AppModals.MERGE_REQUEST_MODAL]: lazy(
    () => import('@/features/admin/requests/actions/components/modal/MergeModal')
  ),
  [AppModals.CREATE_ZONE]: lazy(
    () => import('@/features/admin/zones/components/modals/CreateZoneModal')
  ),
  [AppModals.DELETE_ZONE_MODAL]: lazy(
    () => import('@/features/admin/zones/components/modals/DeleteZoneModal')
  ),
  [AppModals.CREATE_CELL]: lazy(
    () => import('@/features/admin/zones/components/modals/CreateCellModal')
  )
};

const ModalsBank = () => {
  const {
    AppConfigStore: { isOpen, nonce }
  } = useStore();

  const OpenedModalsComponent = useMemo(() => {
    return Object.entries(ModalsMap).reduce(
      (acc: { Render: React.ReactNode; name: string }[], [keyName, Component]) => {
        if (isOpen[keyName as keyof typeof AppModals]) {
          acc.push({ Render: <Component key={keyName} />, name: keyName });
        }
        return acc;
      },
      []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, nonce]);

  return <>{OpenedModalsComponent.map((Modal) => Modal.Render)}</>;
};

export default observer(ModalsBank);
