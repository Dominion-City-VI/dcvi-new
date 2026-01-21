// import { makeObservable, observable, action } from 'mobx';
// import { RootStore } from '@/store';
// import initializer from '@/utils/initializer';
// import { AppModals, TAppModalsAction } from './appModalTypes';

// const INIT_IS_OPEN = initializer(AppModals, false);

// class AppConfigStore {
//   appQueryLimit = 1000;
//   isSideNavOpen = false;

//   isActivityOpen = false;

//   rootStore: RootStore;

//   nonce = 0;

//   doneModal = {
//     text: '',
//     subText: '',
//     ctaText: '',
//     showClose: true
//   };

//   deleteModal = {
//     resourceId: ''
//   };

//   dynamicModal = {
//     title: '',
//     description: '',
//     btnText: '',
//     btnFn: () => {}
//   };

//   addContactModal = {
//     id: '',
//     book: ''
//   };

//   cellMemberModal = {
//     id: ''
//   };

//   cellModal = {
//     cellId: '',
//     zonalId: ''
//   };

//   attendance = {
//     id: '',
//     isAttendaceUpdate: true,
//     sundayServiceDate: '',
//     tuesdayServiceDate: '',
//     cellMeetingDate: ''
//   };

//   departmentAttendance = {
//     id: '',
//     isAttendaceUpdate: true,
//     sundayServiceDate: '',
//     tuesdayServiceDate: '',
//     cellMeetingDate: '',
//     departmentId:''
//   };


//   updateRoleModal = {
//     fullName: '',
//     emailAddress: '',
//     roles: [99],
//     id: '',
//     zoneId:'',
//     cellId:'',
//     departmentId: ''
//   };

//   accessRequestModal = {
//     id: '',
//     requestStatus: 0
//   };

//   adminGrantAccessModal={
//     requestId: '',
//     zoneId: '',
//     cellId:'',
//     roles: [99],
//     requestStatus: 0,
//     departmentId: ''
//   }

//   actionRequestModal = {
//     id: '',
//     requestStatus: 0,
//     requestType: 0,
//     requestorComments: ['']
//   };

//   mergeModal = {
//     requestType: 0,
//     requestorComments: [''],
//     unmapFromId: '',
//     mapToId: ''
//   };

//    acceptRejectModal = {
//     id: '',
//     requestStatus: 0,
//     adminComments: '',
//   };

//   isOpen = { ...INIT_IS_OPEN };

//   constructor(rootStore: RootStore) {
//     makeObservable(this, {
//       appQueryLimit: observable,
//       isSideNavOpen: observable,
//       isActivityOpen: observable,
//       isOpen: observable,
//       nonce: observable,
//       doneModal: observable,
//       deleteModal: observable,
//       dynamicModal: observable,
//       addContactModal: observable,
//       cellMemberModal: observable,
//       cellModal: observable,
//       updateRoleModal: observable,
//       accessRequestModal: observable,
//       adminGrantAccessModal: observable,
//       actionRequestModal: observable,
//       mergeModal: observable,
//       acceptRejectModal:observable,

//       openSideNav: action.bound,
//       openActivityNav: action.bound,
//       toggleModals: action.bound,
//       setModalOpenState: action.bound
//     });
//     this.rootStore = rootStore;
//   }

//   openSideNav(open?: boolean) {
//     this.isSideNavOpen = typeof open === 'undefined' ? !this.isSideNavOpen : open;
//   }

//   openActivityNav(open?: boolean) {
//     this.isActivityOpen = typeof open === 'undefined' ? !this.isActivityOpen : open;
//   }

//   setModalOpenState(name: AppModals, open?: boolean) {
//     this.isOpen[name] = typeof open === 'undefined' ? !this.isOpen[name] : open;
//   }

//   /**
//    * @param modal optional options to be passed to the modal, use the enum `AppModals` to specify
//    * the modal name, if no options are passed, all modals will be closed
//    */
//   toggleModals(modal: TAppModalsAction = {}) {
//     switch (modal.name) {
//       case '':
//         break;
//       case AppModals.DONE:
//         if (modal.open) {
//           this.doneModal = {
//             text: modal.text,
//             subText: modal.subText,
//             ctaText: modal.ctaText ?? 'Got it',
//             showClose: modal.showClose ?? true
//           };
//         }
//         break;
//       case AppModals.DELETE_PHONEBOOK_MODAL:
//         if (modal.open) {
//           this.deleteModal = {
//             resourceId: modal.resourceId
//           };
//         }
//         break;
//       case AppModals.DELETE_CONTACT_MODAL:
//         if (modal.open) {
//           this.deleteModal = {
//             resourceId: modal.resourceId
//           };
//         }
//         break;
//       case AppModals.DELETE_MEMBER_MODAL:
//         if (modal.open) {
//           this.deleteModal = {
//             resourceId: modal.resourceId
//           };
//         }
//         break;
//       case AppModals.ADD_CONTACT_MODAL:
//         if (modal.open) {
//           this.addContactModal = {
//             id: modal.id,
//             book: modal.book
//           };
//         }
//         break;
//       case AppModals.VIEW_MEMBER_MODAL:
//         if (modal.open) {
//           this.cellMemberModal = {
//             id: modal.id
//           };
//         }
//         break;
//       case AppModals.CREATE_CELL:
//         if (modal.open) {
//           this.cellMemberModal = {
//             id: modal.id
//           };
//         }
//         break;
//       case AppModals.CREATE_MEMBER_MODAL:
//         if (modal.open) {
//           this.cellModal = {
//             cellId: modal.cellId,
//             zonalId: modal.zonalId
//           };
//         }
//         break;
//       case AppModals.IMPORT_MEMBER_MODAL:
//         if (modal.open) {
//           this.cellModal = {
//             cellId: modal.cellId,
//             zonalId: modal.zonalId
//           };
//         }
//         break;
//       case AppModals.MARK_ATTENDANCE_MODAL:
//         if (modal.open) {
//           const { sundayServiceDate, tuesdayServiceDate, cellMeetingDate, isAttendaceUpdate } =
//             modal;
//           this.attendance = {
//             id: modal.id,
//             sundayServiceDate,
//             tuesdayServiceDate,
//             cellMeetingDate,
//             isAttendaceUpdate
//           };
//         }
//         break;
//       case AppModals.DELETE_CELL_MODAL:
//         if (modal.open) {
//           this.deleteModal = {
//             resourceId: modal.resourceId
//           };
//         }
//         break;
//       case AppModals.DELETE_ZONE_MODAL:
//         if (modal.open) {
//           this.deleteModal = {
//             resourceId: modal.resourceId
//           };
//         }
//         break;
//       case AppModals.UPDATE_ROLE_MODAL:
//         if (modal.open) {
//           this.updateRoleModal = {
//             fullName: modal.fullName,
//             emailAddress: modal.emailAddress,
//             roles: modal.roles,
//             id: modal.id,            
//             zoneId: modal.zoneId,
//             cellId: modal.cellId,
//             departmentId: modal.departmentId
//           };
//         }
//         break;
//         case AppModals.REVOKE_ROLE_MODAL:
//         if (modal.open) {
//           this.updateRoleModal = {
//             fullName: modal.fullName,
//             emailAddress: modal.emailAddress,
//             roles: modal.roles,
//             id: modal.id,            
//             zoneId: '',
//             cellId: '',
//             departmentId: ''
//           };
//         }
//         break;
//       case AppModals.ACCESS_REQUEST_MODAL:
//         if (modal.open) {
//           this.accessRequestModal = {
//             id: modal.id,
//             requestStatus: modal.requestStatus
//           };
//         }
//         break;
//       case AppModals.ADMIN_ACCESS_REQUEST_MODAL:
//         if (modal.open) {
//           this.adminGrantAccessModal = {
//             requestId: modal.requestId,
//             zoneId: modal.zoneId,
//             cellId: modal.cellId,
//             roles: modal.roles,
//             requestStatus: modal.requestStatus,
//             departmentId: modal.departmentId
//           };
//         }
//         break;
//       case AppModals.ACTION_REQUEST_MODAL:
//         if (modal.open) {
//           this.actionRequestModal = {
//             id: modal.id,
//             requestStatus: modal.requestStatus,
//             requestorComments: modal.requestorComments,
//             requestType: modal.requestType
//           };
//         }
//         break;
//       case AppModals.MERGE_REQUEST_MODAL:
//         if (modal.open) {
//           this.mergeModal = {
//             requestorComments: modal.requestorComments,
//             requestType: modal.requestType,
//             unmapFromId: modal.unmapFromId,
//             mapToId: modal.mapToId
//           };
//         }
//         break;
//         case AppModals.ADMIN_ACCEPT_REJECT_REQUEST_MODAL:
//         if (modal.open) {
//           this.acceptRejectModal = {
//             id: modal.id,
//             requestStatus: modal.requestStatus,
//             adminComments: modal.adminComments
//           };
//         }
//         break;
//         case AppModals.DEPARTMENT_ADD_MEMBER:
//         if (modal.open){

//         }
//         break;
//         case AppModals.DEPARTMENT_MARK_ATTENDANCE_MODAL:
//         if (modal.open) {
//           const { sundayServiceDate, tuesdayServiceDate, cellMeetingDate, isAttendaceUpdate, departmentId } =
//             modal;
//           this.departmentAttendance = {
//             id: modal.id,
//             sundayServiceDate,
//             tuesdayServiceDate,
//             cellMeetingDate,
//             isAttendaceUpdate,
//             departmentId
//           };
//         }
//         break;
//         case AppModals.DEPARTMENT_DELETE_MEMBER_MODAL:
//         if (modal.open){

//         }
//         break;
//       default:
//         this.isOpen = { ...INIT_IS_OPEN };
//         break;
//     }
//     if (modal.name && AppModals[modal.name] !== undefined) {
//       this.setModalOpenState(modal.name, modal.open);
//     }

//     this.nonce = Date.now() + Math.random();
//   }
// }

// export default AppConfigStore;



import { makeObservable, observable, action } from 'mobx';
import { RootStore } from '@/store';
import initializer from '@/utils/initializer';
import { AppModals, TAppModalsAction } from './appModalTypes';
import { department } from '@/hooks/department/FetchKeyFactory';

const INIT_IS_OPEN = initializer(AppModals, false);

class AppConfigStore {
  appQueryLimit = 1000;
  isSideNavOpen = false;

  isActivityOpen = false;

  rootStore: RootStore;

  nonce = 0;

  doneModal = {
    text: '',
    subText: '',
    ctaText: '',
    showClose: true
  };

  deleteModal = {
    resourceId: ''
  };

  deleteUserModal = {
    userId: '',
    departmentid: ''
  };

  dynamicModal = {
    title: '',
    description: '',
    btnText: '',
    btnFn: () => {}
  };

  addContactModal = {
    id: '',
    book: ''
  };

  cellMemberModal = {
    id: ''
  };

  viewDepartmentModal = {
    id: ''
  };

  cellModal = {
    cellId: '',
    zonalId: ''
  };

  departmentAddModal = {
    cellId: '',
    zonalId: '',
    departmentId: ''
  };

  attendance = {
    id: '',
    isAttendaceUpdate: true,
    sundayServiceDate: '',
    tuesdayServiceDate: '',
    cellMeetingDate: ''
  };

  departmentAttendance = {
    id: '',
    isAttendaceUpdate: true,
    sundayServiceDate: '',
    tuesdayServiceDate: '',
    cellMeetingDate: '',
    departmentId:''
  };


  updateRoleModal = {
    fullName: '',
    emailAddress: '',
    roles: [99],
    id: '',
    zoneId:'',
    cellId:'',
    departmentId: ''
  };

  accessRequestModal = {
    id: '',
    requestStatus: 0
  };

  adminGrantAccessModal={
    requestId: '',
    zoneId: '',
    cellId:'',
    roles: [99],
    requestStatus: 0,
    departmentId: ''
  }

  actionRequestModal = {
    id: '',
    requestStatus: 0,
    requestType: 0,
    requestorComments: [''],
    subActionId: ''
  };

  mergeModal = {
    requestType: 0,
    requestorComments: [''],
    unmapFromId: '',
    mapToId: ''
  };

   acceptRejectModal = {
    id: '',
    requestStatus: 0,
    adminComments: '',
  };

  isOpen = { ...INIT_IS_OPEN };

  constructor(rootStore: RootStore) {
    makeObservable(this, {
      appQueryLimit: observable,
      isSideNavOpen: observable,
      isActivityOpen: observable,
      isOpen: observable,
      nonce: observable,
      doneModal: observable,
      deleteModal: observable,
      deleteUserModal: observable,
      dynamicModal: observable,
      addContactModal: observable,
      cellMemberModal: observable,
      cellModal: observable,
      departmentAddModal: observable,
      attendance: observable,
      departmentAttendance: observable, // ✅ THIS WAS MISSING - NOW ADDED!
      updateRoleModal: observable,
      accessRequestModal: observable,
      adminGrantAccessModal: observable,
      actionRequestModal: observable,
      mergeModal: observable,
      acceptRejectModal: observable,
      viewDepartmentModal:observable,

      openSideNav: action.bound,
      openActivityNav: action.bound,
      toggleModals: action.bound,
      setModalOpenState: action.bound
    });
    this.rootStore = rootStore;
  }

  openSideNav(open?: boolean) {
    this.isSideNavOpen = typeof open === 'undefined' ? !this.isSideNavOpen : open;
  }

  openActivityNav(open?: boolean) {
    this.isActivityOpen = typeof open === 'undefined' ? !this.isActivityOpen : open;
  }

  setModalOpenState(name: AppModals, open?: boolean) {
    this.isOpen[name] = typeof open === 'undefined' ? !this.isOpen[name] : open;
  }

  /**
   * @param modal optional options to be passed to the modal, use the enum `AppModals` to specify
   * the modal name, if no options are passed, all modals will be closed
   */
  toggleModals(modal: TAppModalsAction = {}) {
    
    switch (modal.name) {
      case '':
        break;
      case AppModals.DONE:
        if (modal.open) {
          this.doneModal = {
            text: modal.text,
            subText: modal.subText,
            ctaText: modal.ctaText ?? 'Got it',
            showClose: modal.showClose ?? true
          };
        }
        break;
      case AppModals.DELETE_PHONEBOOK_MODAL:
        if (modal.open) {
          this.deleteModal = {
            resourceId: modal.resourceId
          };
        }
        break;
      case AppModals.DELETE_CONTACT_MODAL:
        if (modal.open) {
          this.deleteModal = {
            resourceId: modal.resourceId
          };
        }
        break;
      // case AppModals.DEPARTMENT_DELETE_MEMBER_MODAL:
      //   if(modal.open){
      //     this.deleteUserModal = {
      //       userId: modal.
      //     }
      //   }
      //   break;
      case AppModals.DELETE_MEMBER_MODAL:
        if (modal.open) {
          this.deleteModal = {
            resourceId: modal.resourceId
          };
        }
        break;
      case AppModals.ADD_CONTACT_MODAL:
        if (modal.open) {
          this.addContactModal = {
            id: modal.id,
            book: modal.book
          };
        }
        break;
      case AppModals.VIEW_MEMBER_MODAL:
        if (modal.open) {
          this.cellMemberModal = {
            id: modal.id
          };
        }
        break;
      case AppModals.CREATE_CELL:
        if (modal.open) {
          this.cellMemberModal = {
            id: modal.id
          };
        }
        break;
      case AppModals.DEPARTMENT_VIEW_MEMBER_MODAL:
        if (modal.open) {
          this.cellMemberModal = {
            id: modal.id
          };
        }
        break;
      case AppModals.CREATE_MEMBER_MODAL:
        if (modal.open) {
          this.cellModal = {
            cellId: modal.cellId,
            zonalId: modal.zonalId
          };
        }
        break;
      case AppModals.IMPORT_MEMBER_MODAL:
        if (modal.open) {
          this.cellModal = {
            cellId: modal.cellId,
            zonalId: modal.zonalId
          };
        }
        break;
      case AppModals.MARK_ATTENDANCE_MODAL:
        if (modal.open) {
          const { sundayServiceDate, tuesdayServiceDate, cellMeetingDate, isAttendaceUpdate } =
            modal;
          this.attendance = {
            id: modal.id,
            sundayServiceDate,
            tuesdayServiceDate,
            cellMeetingDate,
            isAttendaceUpdate
          };
        }
        break;
      case AppModals.DELETE_CELL_MODAL:
        if (modal.open) {
          this.deleteModal = {
            resourceId: modal.resourceId
          };
        }
        break;
      case AppModals.DELETE_ZONE_MODAL:
        if (modal.open) {
          this.deleteModal = {
            resourceId: modal.resourceId
          };
        }
        break;
      case AppModals.UPDATE_ROLE_MODAL:
        if (modal.open) {
          this.updateRoleModal = {
            fullName: modal.fullName,
            emailAddress: modal.emailAddress,
            roles: modal.roles,
            id: modal.id,            
            zoneId: modal.zoneId,
            cellId: modal.cellId,
            departmentId: modal.departmentId
          };
        }
        break;
        case AppModals.REVOKE_ROLE_MODAL:
        if (modal.open) {
          this.updateRoleModal = {
            fullName: modal.fullName,
            emailAddress: modal.emailAddress,
            roles: modal.roles,
            id: modal.id,            
            zoneId: '',
            cellId: '',
            departmentId: ''
          };
        }
        break;
      case AppModals.ACCESS_REQUEST_MODAL:
        if (modal.open) {
          this.accessRequestModal = {
            id: modal.id,
            requestStatus: modal.requestStatus
          };
        }
        break;
      case AppModals.ADMIN_ACCESS_REQUEST_MODAL:
        if (modal.open) {
          this.adminGrantAccessModal = {
            requestId: modal.requestId,
            zoneId: modal.zoneId,
            cellId: modal.cellId,
            roles: modal.roles,
            requestStatus: modal.requestStatus,
            departmentId: modal.departmentId
          };
        }
        break;
      case AppModals.ACTION_REQUEST_MODAL:
        if (modal.open) {
          this.actionRequestModal = {
            id: modal.id,
            requestStatus: modal.requestStatus,
            requestorComments: modal.requestorComments,
            requestType: modal.requestType,
            subActionId: modal.subActionId,
          };
        }
        break;
      case AppModals.MERGE_REQUEST_MODAL:
        if (modal.open) {
          this.mergeModal = {
            requestorComments: modal.requestorComments,
            requestType: modal.requestType,
            unmapFromId: modal.unmapFromId,
            mapToId: modal.mapToId
          };
        }
        break;
        case AppModals.ADMIN_ACCEPT_REJECT_REQUEST_MODAL:
        if (modal.open) {
          this.acceptRejectModal = {
            id: modal.id,
            requestStatus: modal.requestStatus,
            adminComments: modal.adminComments
          };
        }
        break;
        case AppModals.DEPARTMENT_ADD_MEMBER:
        if (modal.open) {
          this.departmentAddModal = {
            cellId: modal.cellId,
            zonalId: modal.zonalId,
            departmentId: modal.departmentId
          };
        }
        break;
        case AppModals.DEPARTMENT_MARK_ATTENDANCE_MODAL:
        if (modal.open) {
          const { sundayServiceDate, tuesdayServiceDate, cellMeetingDate, isAttendaceUpdate, departmentId } =
            modal;
          this.departmentAttendance = {
            id: modal.id,
            sundayServiceDate,
            tuesdayServiceDate,
            cellMeetingDate,
            isAttendaceUpdate,
            departmentId
          };
        }
        break;
        case AppModals.DEPARTMENT_DELETE_MEMBER_MODAL:
        if (modal.open) {
          this.deleteUserModal = {
            userId: modal.userId,
            departmentid: modal.departmentId // or rename this field to departmentId for consistency
          };
        }
        break;

        case AppModals.VIEW_DEPARTMENT_MODAL:
        if (modal.open) {
          this.viewDepartmentModal = {
            id: modal.id
          };
        }
        break;

      default:
        this.isOpen = { ...INIT_IS_OPEN };
        break;
    }
    if (modal.name && AppModals[modal.name] !== undefined) {
      this.setModalOpenState(modal.name, modal.open);
    }

    this.nonce = Date.now() + Math.random();
  }
}

export default AppConfigStore;