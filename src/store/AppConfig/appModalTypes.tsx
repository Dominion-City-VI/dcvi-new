export enum AppModals {
  DONE = 'DONE',
  LOG_OUT_MODAL = 'LOG_OUT_MODAL',
  IMPORT_PHONEBOOK = 'IMPORT_PHONEBOOK',
  DELETE_PHONEBOOK_MODAL = 'DELETE_PHONEBOOK_MODAL',
  DELETE_CONTACT_MODAL = 'DELETE_CONTACT_MODAL',
  ADD_CONTACT_MODAL = 'ADD_CONTACT_MODAL',
  CREATE_MEMBER_MODAL = 'CREATE_MEMBER_MODAL',
  VIEW_MEMBER_MODAL = 'VIEW_MEMBER_MODAL',
  DELETE_MEMBER_MODAL = 'DELETE_MEMBER_MODAL',
  MARK_ATTENDANCE_MODAL = 'MARK_ATTENDANCE_MODAL',
  DEPARTMENT_MARK_ATTENDANCE_MODAL = 'DEPARTMENT_MARK_ATTENDANCE_MODAL',
  SEND_SMS_MODAL = 'SEND_SMS_MODAL',
  FUND_WALLET_MODAL = 'FUND_WALLET_MODAL',
  DELETE_CELL_MODAL = 'DELETE_CELL_MODAL',
  DELETE_ZONE_MODAL = 'DELETE_ZONE_MODAL',
  REQUEST_ZONE_DELETE_MODAL = 'REQUEST_ZONE_DELETE_MODAL',
  IMPORT_MEMBER_MODAL = 'IMPORT_MEMBER_MODAL',
  UPDATE_ROLE_MODAL = 'UPDATE_ROLE_MODAL',
  REVOKE_ROLE_MODAL = 'REVOKE_ROLE_MODAL',
  ACCESS_REQUEST_MODAL = 'ACCESS_REQUEST_MODAL',
  ADMIN_ACCESS_REQUEST_MODAL = 'ADMIN_ACCESS_REQUEST_MODAL',
  ACTION_REQUEST_MODAL = 'ACTION_REQUEST_MODAL',
  MERGE_REQUEST_MODAL = 'MERGE_REQUEST_MODAL',
  DELETE_REQUEST_MODAL = 'DELETE_REQUEST_MODAL',
  CREATE_ZONE = 'CREATE_ZONE',
  CREATE_CELL = 'CREATE_CELL',
  ADMIN_ACCEPT_REJECT_REQUEST_MODAL = 'ADMIN_ACCEPT_REJECT_REQUEST_MODAL',
  DEPARTMENT_ADD_MEMBER = 'DEPARTMENT_ADD_MEMBER',
  DEPARTMENT_DELETE_MEMBER_MODAL = 'DEPARTMENT_DELETE_MEMBER_MODAL',
  DEPARTMENT_VIEW_MEMBER_MODAL = 'DEPARTMENT_VIEW_MEMBER_MODAL',
  VIEW_DEPARTMENT_MODAL = 'VIEW_DEPARTMENT_MODAL',
}

export type TAppModalsAction =
  | { name?: undefined }
  | {
      name: '';
      open?: boolean;
    }
  | ({
      name:
        | AppModals.LOG_OUT_MODAL
        | AppModals.IMPORT_PHONEBOOK
        | AppModals.SEND_SMS_MODAL
        | AppModals.FUND_WALLET_MODAL
        | AppModals.CREATE_ZONE;
    } & {
      open: boolean;
    })
  | ({
      name:
        | AppModals.DELETE_PHONEBOOK_MODAL
        | AppModals.DELETE_CONTACT_MODAL
        | AppModals.DELETE_CELL_MODAL
        | AppModals.DELETE_ZONE_MODAL
        | AppModals.DELETE_MEMBER_MODAL;
    } & (
      | {
          open: boolean;
          resourceId: string;
        }
      | { open?: false }
    ))
  | ({ name: AppModals.DEPARTMENT_DELETE_MEMBER_MODAL } & (
      | {
          open: true;
          userId: string,
          departmentId: string
        }
      | { open?: false }
    ))
  | ({ name: AppModals.DONE } & (
      | {
          open: true;
          text: string;
          subText: string;
          ctaText?: string;
          showClose?: boolean;
        }
      | { open?: false }
    ))
  | ({ name: AppModals.ADD_CONTACT_MODAL } & (
      | {
          open: true;
          id: string;
          book: string;
        }
      | { open?: false }
    ))
  | ({
      name: AppModals.VIEW_MEMBER_MODAL | AppModals.DEPARTMENT_VIEW_MEMBER_MODAL | AppModals.CREATE_CELL | AppModals.VIEW_DEPARTMENT_MODAL;
    } & (
      | {
          open: true;
          id: string;
        }
      | { open?: false }
    ))
  | ({ name: AppModals.MARK_ATTENDANCE_MODAL } & (
      | {
          open: true;
          id: string;
          isAttendaceUpdate: boolean;
          sundayServiceDate: string;
          tuesdayServiceDate: string;
          cellMeetingDate: string;
        }
      | { open?: false }
    ))
  |
  ({ name: AppModals.DEPARTMENT_MARK_ATTENDANCE_MODAL } & (
      | {
          open: true;
          id: string;
          isAttendaceUpdate: boolean;
          sundayServiceDate: string;
          tuesdayServiceDate: string;
          cellMeetingDate: string;
          departmentId: string;
        }
      | { open?: false }
    ))
  |  
  ({ name: AppModals.DELETE_REQUEST_MODAL } & (
      | {
          open: true;
          id: string;
        }
      | { open?: false }
    ))
  | ({ name: AppModals.UPDATE_ROLE_MODAL } & (
      | {
          open: true;
          fullName: string;
          emailAddress: string;
          roles: Array<number>;
          id: string;
          zoneId: string;
          cellId: string;
          departmentId: string;
        }
      | { open?: false }
    ))
  | 
  ({ name: AppModals.REVOKE_ROLE_MODAL } & (
      | {
          open: true;
          fullName: string;
          emailAddress: string;
          roles: Array<number>;
          id: string;
        }
      | { open?: false }
    ))
  | ({ name: AppModals.ACCESS_REQUEST_MODAL } & (
      | {
          open: true;
          id: string;
          requestStatus: number;
        }
      | { open?: false }
    ))
    | ({ name: AppModals.ADMIN_ACCESS_REQUEST_MODAL } & (
      | {
          open: true;
          requestId: string;
          zoneId: string;
          cellId: string;
          roles: Array<number>;
          requestStatus: number;
          departmentId: string
        }
      | { open?: false }
    ))
  | ({ name: AppModals.ACTION_REQUEST_MODAL } & (
      | {
          open: true;
          id: string;
          requestType: number;
          requestorComments: Array<string>;
          requestStatus: number;
          subActionId: string;
        }
      | { open?: false }
    ))
  | ({ name: AppModals.MERGE_REQUEST_MODAL } & (
      | {
          open: true;
          requestType: number;
          requestorComments: Array<string>;
          unmapFromId: string;
          mapToId: string;
        }
      | { open?: false }
    ))
    | ({ name: AppModals.ADMIN_ACCEPT_REJECT_REQUEST_MODAL } & (
      | {
          open: true;
          id: string;
          requestStatus: number;
          adminComments: string;
        }
      | { open?: false }
    ))
  | ({
      name: AppModals.CREATE_MEMBER_MODAL | AppModals.IMPORT_MEMBER_MODAL;
    } & (
      | {
          open: true;
          cellId: string;
          zonalId: string;
        }
      | { open?: false }
    ))
    | ({
      name: AppModals.DEPARTMENT_ADD_MEMBER;
    } & (
      | {
          open: true;
          cellId: string;
          zonalId: string;
          departmentId: string
        }
      | { open?: false }
    ));
