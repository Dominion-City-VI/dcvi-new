import { action, flow, makeObservable, observable } from 'mobx';
import { RootStore } from '..';
import initializer from '@/utils/initializer';
import { TUpdateRoleSchema } from '@/features/admin/users/components/modals/UpdateRoleModal';
import { useStyledToast } from '@/hooks/custom/useStyledToast';
import { parseError } from '@/utils/errorHandler';
import { putRequest, putUpdateRole, putMergeZone, putMergeCell, postGrantAccess } from '@/requests/admin';
import { TAccessRequestSchema } from '@/features/admin/requests/access/components/modal/AccessModal';

const INIT_IS_LOADING = {
  updateRole: false,
  approveRejectAccess: false,
  mergeRequest: false,

  deleteZone: false,
  deleteCell: false,
  deleteMember: false,
};

// eslint-disable-next-line react-hooks/rules-of-hooks
const toast = useStyledToast();

class AdminStore {
  rootStore: RootStore;
  usersQuery = { Limit: 10, Page: 1 };
  zoneQuery = { Limit: 10, Page: 1 };
  adminZoneAttendanceQuery: Partial<TAdminZonalAttendanceQuery> = {};
  isLoading = { ...INIT_IS_LOADING };
  errors = initializer(this.isLoading, '');

  constructor(_rootStore: RootStore) {
    makeObservable(this, {
      usersQuery: observable,
      zoneQuery: observable,
      adminZoneAttendanceQuery: observable,
      isLoading: observable,
      errors: observable,

      setLimit: action.bound,
      setPage: action.bound,

      updateUserRole: flow.bound,
      approveRejectAccess: flow.bound,
      mergeRequest: flow.bound,

      
      applyAttendanceFilter: action.bound,
      resetAttendanceFilter: action.bound,
    });
    this.rootStore = _rootStore;
  }

   applyAttendanceFilter(_filter: Partial<TAdminZonalAttendanceQuery>) {
    if (_filter.StartAt) {
      _filter.StartAt = new Date(_filter.StartAt).toISOString();
    }

    if (_filter.EndAt) {
      _filter.EndAt = new Date(_filter.EndAt).toISOString();
    }

    this.adminZoneAttendanceQuery = _filter;
  }

  resetAttendanceFilter() {
    this.adminZoneAttendanceQuery = {};
  }

  hasFilter(filter: Partial<TAdminZonalAttendanceQuery>) {
    return Object.entries(filter).some(
      ([, value]) => value !== undefined && value !== null && value !== ''
    );
  }

  setLimit(limit: number) {
    this.usersQuery.Limit = limit;
  }

  setPage(page: number) {
    this.usersQuery.Page = page;
  }

  setZoneLimit(limit: number) {
    this.zoneQuery.Limit = limit;
  }

  setZonePage(page: number) {
    this.zoneQuery.Page = page;
  }

  *updateUserRole(payload: TUpdateRoleSchema, cb?: () => void) {
    this.isLoading.updateRole = true;
    this.errors.updateRole = '';

    try {
      yield putUpdateRole(payload);
      toast.success('user role updated!');
      cb?.();
    } catch (error) {
      toast.error(parseError(error));
    } finally {
      this.isLoading.updateRole = false;
    }
  }

  async grantUserAccess(payload: TAdminGrantAccessPayload, cb?: () => void) {
    this.isLoading.approveRejectAccess = true;
    this.errors.approveRejectAccess = ''; // Reset any previous errors

    try {
      // Now using async/await instead of yield
      await postGrantAccess(payload); // Assuming postGrantAccess is a Promise-returning function
      cb?.(); // Call the callback if provided
    } catch (error) {
      toast.error(parseError(error)); // Handle errors appropriately
    } finally {
      this.isLoading.approveRejectAccess = false; // Reset loading state
    }
  }

  *approveRejectAccess(payload: TAccessRequestSchema, cb?: () => void) {
    this.isLoading.approveRejectAccess = true;
    this.errors.approveRejectAccess = '';

    try {
      yield putRequest(payload);
      cb?.();
    } catch (error) {
      toast.error(parseError(error));
    } finally {
      this.isLoading.approveRejectAccess = false;
    }
  }

  *mergeRequest(payload: TAdminMergeReqs, type: string, cb?: () => void) {
    this.isLoading.mergeRequest = true;
    this.errors.mergeRequest = '';

    try {
      if (type === 'zone') {
        yield putMergeZone(payload);
      } else {
        yield putMergeCell(payload);
      }

      cb?.();
    } catch (error) {
      toast.error(parseError(error));
    } finally {
      this.isLoading.mergeRequest = false;
    }
  }
}

export default AdminStore;
