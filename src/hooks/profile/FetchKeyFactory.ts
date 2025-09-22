import { PROFILE } from '@/constants/api';

export const profile = {
  getProfile() {
    return {
      path: PROFILE.USER_INFO,
      keys: () => [PROFILE.USER_INFO] as const
    };
  }
};
