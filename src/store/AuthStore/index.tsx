import initializer from '@/utils/initializer';
import { RootStore } from '..';
import store from 'store2';
import { action, flow, makeObservable, observable } from 'mobx';
import { Mangle, REQUEST_FORM } from '@/constants/mangle';
import {
  TForgotPwd,
  TLogin,
  TPersonalInfoSchema,
  TPwdResetSchema,
  TUserRequestSchema
} from '@/features/auth/validation';
import {
  getConfirmEmail,
  getForgotPwd,
  postNewToken,
  postPwdReset,
  postRequestAccess,
  postUserLogin
} from '@/requests/auth';
import { parseError } from '@/utils/errorHandler';
import { Route as LOGIN } from '@/routes/auth/login';
import { TVerifyEmailSearchSchema } from '@/routes/auth/verification';
import { AxiosResponse } from 'axios';
import { getProfile } from '@/requests/profile';
import { useStyledToast } from '@/hooks/custom/useStyledToast';
import { EnumRoles } from '@/constants/mangle';
import localServer from '@/servers/localServer';

// eslint-disable-next-line react-hooks/rules-of-hooks
const toast = useStyledToast();

const INIT_IS_LOADING = {
  logout: false,
  login: false,
  request: false,
  reset: false,
  forgotPwd: false,
  refresh: false,
  verify: false
};

const DEFAULT_ROLE_SENTINEL = 99;

export function persist<T = string>(key: string, value: T) {
  store.namespace('auth').local.set(key, value);
  return value;
}

function get<T = string>(key: string, fallback?: T) {
  return store.namespace('auth').local.get(key, fallback) as T;
}

function del(key: string) {
  return store.namespace('auth').local.remove(key);
}

class AuthStore {
  rootStore: RootStore;
  user = get<Partial<TProfileInfo>>(Mangle.USER, {});
  userRole = get<Array<number>>(Mangle.USER_ROLE, []);
  activeRole = get<number>(Mangle.USER_ACTIVE_ROLE, DEFAULT_ROLE_SENTINEL);
  userExtraInfo = get<Partial<TProfileExtraInfo>>(Mangle.USER_EXTRA_INFO, {});
  accessToken = get(Mangle.ACCESS_TOKEN, '');
  refreshToken = get(Mangle.REFRESH_TOKEN, '');
  isLoading = { ...INIT_IS_LOADING };
  errors = initializer(this.isLoading, '');
  personalInfo: Partial<TPersonalInfoSchema> = {};
  requestForm = REQUEST_FORM.PERSONAL;

  constructor(_rootStore: RootStore) {
    this.rootStore = _rootStore;

    makeObservable(this, {
      user: observable,
      userRole: observable,
      activeRole: observable,
      userExtraInfo: observable,
      accessToken: observable,
      refreshToken: observable,
      isLoading: observable,
      errors: observable,
      personalInfo: observable,
      requestForm: observable,

      updateActiveRole: flow.bound,
      reset: action.bound,
      resetStores: action.bound,
      setTokens: action.bound,
      changeReqForm: action.bound,
      setPersonalInfo: action.bound,
      logout: action.bound,
      updateUser: action.bound,

      login: flow.bound,
      fetchNewToken: flow.bound,
      userRequestAccess: flow.bound,
      forgotPwd: flow.bound,
      resetPwd: flow.bound,
      verify: flow.bound
    });
  }

  // updateActiveRole(role: number, cb?: () => void) {
  //   this.activeRole = persist(Mangle.USER_ACTIVE_ROLE, role);
  //   cb?.();
  // }

  *updateActiveRole(role: number, cb?: () => void) {
    this.activeRole = persist(Mangle.USER_ACTIVE_ROLE, role);

    try {
      const result = (yield getProfile()) as AxiosResponse<IDCVIServerRes<TLoginRes>>;

      if (result.data.status) {
        this.user = persist(Mangle.USER, result.data.data);
        if (result.data.data.extraInfo) {
          this.userExtraInfo = persist(Mangle.USER_EXTRA_INFO, result.data.data.extraInfo);
        }
      }

      // For roles that need a specific cell/zone context, look up from local DB
      const roleNeedsContext = [
        EnumRoles.CELL_LEADER,
        EnumRoles.ASST_CELL_LEADER,
        EnumRoles.ZONAL_PASTOR,
        EnumRoles.DEPARTMENTAL_HEAD,
        EnumRoles.ASST_DEPARTMENTAL_HEAD
      ].includes(role);

      if (roleNeedsContext) {
        const email = (this.user as Partial<TProfileInfo>).email;
        if (email) {
          try {
            const ctxRes = (yield localServer.get('/analytics/leader-context', {
              params: { email }
            })) as AxiosResponse<IDCVIServerRes<{ cellId: string | null; zonalId: string | null; userId: string }>>;

            if (ctxRes.data.status && ctxRes.data.data) {
              const { cellId, zonalId } = ctxRes.data.data;
              this.userExtraInfo = persist(Mangle.USER_EXTRA_INFO, {
                ...this.userExtraInfo,
                ...(cellId ? { cellId } : {}),
                ...(zonalId ? { zonalId } : {})
              });
            }
          } catch (_ctxErr) {
            // Context fetch failed — userExtraInfo remains from login
          }
        }
      }

      cb?.();
    } catch (error) {
      toast.error('Failed to switch role');
      console.error(error);
    }
  }

  reset() {
    this.accessToken = '';
    this.refreshToken = '';
    this.isLoading = { ...INIT_IS_LOADING };
    this.errors = initializer(this.isLoading, '');
    del(Mangle.USER);
    del(Mangle.USER_ROLE);
    del(Mangle.USER_EXTRA_INFO);
    this.user = {};
    this.activeRole = DEFAULT_ROLE_SENTINEL;
    this.userRole = [];
    this.userExtraInfo = {};
  }

  resetStores() {
    this.reset();
    this.rootStore.AppConfigStore.toggleModals();
    store.clearAll();
  }

  setTokens(token: string, refreshToken: string) {
    this.accessToken = persist(Mangle.ACCESS_TOKEN, token);
    this.refreshToken = persist(Mangle.REFRESH_TOKEN, refreshToken);
  }

  changeReqForm() {
    if (this.requestForm === REQUEST_FORM.PERSONAL) {
      this.requestForm = REQUEST_FORM.OTHERS;
    } else {
      this.requestForm = REQUEST_FORM.PERSONAL;
    }
  }

  setPersonalInfo(info: TPersonalInfoSchema) {
    this.personalInfo = info;
  }

  updateUser(user: TProfileInfo) {
    this.user = persist(Mangle.USER, user);
  }

  logout(cb?: () => void) {
    this.isLoading.login = true;
    try {
      this.resetStores();
      toast.success('You have been sucessfully logged out!');
      if (cb) {
        cb();
      } else {
        window.location.href = LOGIN.fullPath;
      }
    } catch (error) {
      toast.error(parseError(error));
      this.errors.logout = parseError(error);
      setTimeout(() => {
        this.errors.logout = '';
      }, 5000);
    } finally {
      this.isLoading.login = false;
    }
  }

  *login(_payload: TLogin, cb?: () => void) {
    this.isLoading.login = true;
    this.errors.login = '';
    try {
      const res = (yield postUserLogin(_payload)) as AxiosResponse<IDCVIServerRes<TLoginRes>>;
      if (res.data.status) {
        this.userRole = persist(Mangle.USER_ROLE, res.data.data.roles);
        this.activeRole = persist(Mangle.USER_ACTIVE_ROLE, this.userRole[0]);
        this.userExtraInfo = persist(Mangle.USER_EXTRA_INFO, res.data.data.extraInfo);
        this.setTokens(res.data.data.token, res.data.data.refreshToken);

        const result = (yield getProfile()) as AxiosResponse<IDCVIServerRes<TProfileInfo>>;

        if (result.data.status) {
          this.user = persist(Mangle.USER, result.data.data);
        }
        toast.info('Welcome back!');
        cb?.();
      }
    } catch (error) {
      this.errors.login = parseError(error);
      toast.error(this.errors.login);
    } finally {
      this.isLoading.login = false;
    }
  }

  *fetchNewToken() {
    this.isLoading.refresh = true;
    try {
      const { data } = (yield postNewToken({
        token: this.accessToken,
        refreshToken: this.refreshToken
      })) as { data: TLoginRes };

      this.setTokens(data.token, data.refreshToken);

      return { token: this.accessToken, refreshToken: this.refreshToken };
    } catch (error) {
      this.errors.refresh = parseError(error);
    } finally {
      this.isLoading.refresh = false;
    }
  }

  *userRequestAccess(_payload: TUserRequestSchema, cb?: () => void) {
    this.isLoading.request = true;
    this.errors.request = '';
    try {
      const data = (yield postRequestAccess(_payload)) as { data: boolean };

      if (data.data) {
        toast.info('Verify email address', {
          description:
            'Check your inbox or spam to verify your email address. Your request will only be sent after email verification'
        });
        this.personalInfo = {};
        cb?.();
      }
    } catch (error) {
      this.errors.request = parseError(error);
      toast.error(this.errors.request);
    } finally {
      this.isLoading.request = false;
    }
  }

  *forgotPwd(_payload: TForgotPwd, cb?: () => void) {
    this.isLoading.forgotPwd = true;
    this.errors.forgotPwd = '';
    try {
      const data = (yield getForgotPwd(_payload)) as IDCVIServerRes<boolean>;

      if(data.data){
        toast.success("Password reset", 'An OTP has been sent to your inbox or spam');
        cb?.();
      }      
    } catch (error) {
      this.errors.forgotPwd = parseError(error);
      toast.error(this.errors.forgotPwd);
    } finally {
      this.isLoading.forgotPwd = false;
    }
  }

  // *resetPwd(_payload: TPwdResetSchema, cb?: () => void) {
  //   this.isLoading.reset = true;
  //   this.errors.reset = '';
  //   try {
  //     const { emailAddress, newPassword, otp } = _payload;
  //     const data = (yield postPwdReset({ emailAddress, newPassword, otp })) as { data: TLoginRes };

  //     if (data.data.isEmailVerified) {
  //       toast.success('Password has been reset!');
  //       cb?.();
  //     }
  //   } catch (error) {
  //     this.errors.reset = parseError(error);
  //   } finally {
  //     this.isLoading.reset = false;
  //   }
  // }

*resetPwd(_payload: TPwdResetSchema) {
  this.isLoading.reset = true;
  this.errors.reset = '';
  try {
    const { emailAddress, newPassword, otp } = _payload;
    const data = (yield postPwdReset({ emailAddress, newPassword, otp })) as { data: TLoginRes };
    return data.data;
  } catch (error) {
    this.errors.reset = parseError(error);
    throw error;
  } finally {
    this.isLoading.reset = false;
  }
}

  *verify(_query: TVerifyEmailSearchSchema) {
    this.isLoading.verify = true;
    this.errors.verify = '';
    try {
      const data = (yield getConfirmEmail(_query)) as IDCVIServerRes<boolean>;
      return data;
    } catch (error) {
      this.errors.verify = parseError(error);
    } finally {
      this.isLoading.verify = false;
    }
  }
}

export default AuthStore;
