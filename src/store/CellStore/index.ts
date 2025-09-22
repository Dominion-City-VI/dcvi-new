import { action, makeObservable, observable } from 'mobx';
import { RootStore } from '..';
import initializer from '@/utils/initializer';
import { useStyledToast } from '@/hooks/custom/useStyledToast';
import { delCell, delCellMember } from '@/requests/cell';
import { parseError } from '@/utils/errorHandler';

// eslint-disable-next-line react-hooks/rules-of-hooks
const toast = useStyledToast();

const INIT_IS_LOADING = {
  delCell: false
};

class CellStore {
  rootStore: RootStore;
  attendanceQuery: Partial<TCellAttendanceQuery> = {};
  isLoading = { ...INIT_IS_LOADING };
  errors = initializer(this.isLoading, '');

  constructor(_rootStore: RootStore) {
    makeObservable(this, {
      attendanceQuery: observable,
      isLoading: observable,
      errors: observable,

      applyAttendanceFilter: action.bound,
      resetAttendanceFilter: action.bound,
      hasFilter: action.bound
    });
    this.rootStore = _rootStore;
  }

  applyAttendanceFilter(_filter: Partial<TCellAttendanceQuery>) {
    if (_filter.StartAt) {
      _filter.StartAt = new Date(_filter.StartAt).toISOString();
    }

    if (_filter.EndAt) {
      _filter.EndAt = new Date(_filter.EndAt).toISOString();
    }

    this.attendanceQuery = _filter;
  }

  resetAttendanceFilter() {
    this.attendanceQuery = {};
  }

  hasFilter(filter: Partial<TCellAttendanceQuery>) {
    return Object.entries(filter).some(
      ([, value]) => value !== undefined && value !== null && value !== ''
    );
  }

  *deleteCell(id: string, cb?: () => void) {
    this.isLoading.delCell = true;
    this.errors.delCell = '';

    try {
      yield delCell(id);
      cb?.();
    } catch (error) {
      toast.error(parseError(error));
    } finally {
      this.isLoading.delCell = false;
    }
  }

  *deleteMember(id: string, cb?: () => void) {
    this.isLoading.delCell = true;
    this.errors.delCell = '';

    try {
      yield delCellMember(id);
      cb?.();
    } catch (error) {
      toast.error(parseError(error));
    } finally {
      this.isLoading.delCell = false;
    }
  }
}

export default CellStore;
