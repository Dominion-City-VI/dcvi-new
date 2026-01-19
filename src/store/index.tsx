'use client';
import { createContext, useContext } from 'react';
import { configure } from 'mobx';
import AuthStore from './AuthStore';
import AppConfigStore from './AppConfig';
import CellStore from './CellStore';
import WalletStore from './WalletStore';
import ZoneStore from './ZoneStore';
import AdminStore from './AdminStore';
import SMSStore from './SmsStore';
import DepartmentStore from './DepartmentStore';

configure({
  enforceActions: 'observed',
  computedRequiresReaction: true
});

interface StoreProviderProps {
  children: React.ReactNode;
}

export class RootStore {
  AppConfigStore: AppConfigStore;
  AuthStore: AuthStore;
  CellStore: CellStore;
  DepartmentStore: DepartmentStore;
  WalletStore: WalletStore;
  ZoneStore: ZoneStore;
  AdminStore: AdminStore;
  SMSStore: SMSStore;

  constructor() {
    this.AppConfigStore = new AppConfigStore(this);
    this.AuthStore = new AuthStore(this);
    this.CellStore = new CellStore(this);
    this.DepartmentStore = new DepartmentStore(this);
    this.WalletStore = new WalletStore(this);
    this.ZoneStore = new ZoneStore(this);
    this.AdminStore = new AdminStore(this);
    this.SMSStore = new SMSStore(this);
  }
}

/**
 * ### Root Store Instance
 * This is the root store instance.
 * It is used to access all the stores.
 * and can be used to access the store properties outside of the component.
 */
export const Stores = new RootStore();

const StoreContext = createContext<RootStore>(Stores);

export const StoreProvider = ({ children }: StoreProviderProps) => (
  <StoreContext.Provider value={Stores}>{children}</StoreContext.Provider>
);

export const useStore = () => useContext(StoreContext);
