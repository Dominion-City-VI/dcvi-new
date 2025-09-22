import { USER } from '@/constants/api';
import { TAccountFormSchema } from '@/features/settings/account/account-form';
import { TProfileFormSchema } from '@/features/settings/profile/profile-form';
import dcviServer from '@/servers/dcvi';

// put
export const putPwdUpdate = (payload: Omit<TAccountFormSchema, 'confirmNewPassword'>) =>
  dcviServer.put<IDCVIServerRes<TLoginRes>>(USER.UPDATE_PWD, payload);

export const putBioUpdate = (payload: TProfileFormSchema) => {
  return dcviServer.put<IDCVIServerRes<TLoginRes>>(USER.BIO_DATA, {
    ...payload,
    trainings: payload.trainings.map((training) => training.value),
    departments: payload.departments.map((dept) => dept.value),
    gender: Number(payload.gender),
    maritalStatus: Number(payload.maritalStatus)
  });
};
