import { action, makeObservable, observable } from 'mobx';
import { RootStore } from '..';

class ZoneStore {
  rootStore: RootStore;
  zoneQuery = { Limit: 10000, Page: 1 };
  zoneAttendanceQuery: Partial<TZoneAttendanceQuery> = {};

  constructor(_rootStore: RootStore) {
    makeObservable(this, {
      zoneQuery: observable,
      zoneAttendanceQuery: observable,

      applyAttendanceFilter: action.bound,
      resetAttendanceFilter: action.bound,
      setZoneLimit: action.bound,
      setZonePage: action.bound
    });
    this.rootStore = _rootStore;
  }

  applyAttendanceFilter(_filter: Partial<TZoneAttendanceQuery>) {
    if (_filter.StartAt) {
      _filter.StartAt = new Date(_filter.StartAt).toISOString();
    }

    if (_filter.EndAt) {
      _filter.EndAt = new Date(_filter.EndAt).toISOString();
    }

    this.zoneAttendanceQuery = _filter;
  }

  resetAttendanceFilter() {
    this.zoneAttendanceQuery = {};
  }

  hasFilter(filter: Partial<TZoneAttendanceQuery>) {
    return Object.entries(filter).some(
      ([, value]) => value !== undefined && value !== null && value !== ''
    );
  }

  setZoneLimit(limit: number) {
    this.zoneQuery.Limit = limit;
  }

  setZonePage(page: number) {
    this.zoneQuery.Page = page;
  }
}

export default ZoneStore;
