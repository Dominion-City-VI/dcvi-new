import { action, makeObservable, observable } from 'mobx';
import { RootStore } from '..';

class SMSStore {
  rootStore: RootStore;
  transQuery = { Limit: null as number | null, Page: 1 };

  constructor(_rootStore: RootStore) {
    makeObservable(this, {
      transQuery: observable,

      setLimit: action.bound,
      setPage: action.bound
    });
    this.rootStore = _rootStore;
  }

  setLimit(limit: number) {
    this.transQuery.Limit = limit;
  }

  setPage(page: number) {
    this.transQuery.Page = page;
  }
}

export default SMSStore;
