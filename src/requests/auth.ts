import {
  TForgotPwd,
  TLogin,
  TPwdResetSchema,
  TUserRequestSchema
} from '@/features/auth/validation';
import { AUTH } from '@/constants/api';
import { TVerifyEmailSearchSchema } from '@/routes/auth/verification';
import dcviServer from '@/servers/dcvi';

// post
export const postUserLogin = (payload: TLogin) =>
  dcviServer.post<IDCVIServerRes<TLoginRes>>(AUTH.LOGIN, payload);

export const postNewToken = (payload: TAuthTokenObj) =>
  dcviServer.post<IDCVIServerRes<TLoginRes>>(AUTH.NEW_TOKEN, payload);

export const postRequestAccess = (payload: TUserRequestSchema) => {
  return dcviServer.post<IDCVIServerRes<boolean>>(AUTH.USER_REQUEST, {
    ...payload,
    trainings: payload.trainings.map((training) => training.value),
    departments: payload.departments.map((dept) => dept.value),
    gender: Number(payload.gender),
    maritalStatus: Number(payload.maritalStatus)
  });
};

export const postPwdReset = (payload: Omit<TPwdResetSchema, 'rePassword'>) =>
  dcviServer.post<IDCVIServerRes<TLoginRes>>(AUTH.RESET_PWD, payload);

// get
export const getConfirmEmail = (params: TVerifyEmailSearchSchema) =>
  dcviServer.get<IDCVIServerRes<boolean>>(AUTH.CONFIRM_EMAIL, { params });

export const getForgotPwd = (params: TForgotPwd) =>
  dcviServer.get<IDCVIServerRes<boolean>>(AUTH.FORGOT_PWD, { params });
