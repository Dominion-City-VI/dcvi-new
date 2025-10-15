import { action, makeObservable, observable } from 'mobx';
import { RootStore } from '..';

class WalletStore {
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

export default WalletStore;
