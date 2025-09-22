import { SETTINGS } from '@/constants/api';

export const settings = {
  getTrainings() {
    return {
      path: SETTINGS.TRAININGS,
      keys: () => [SETTINGS.TRAININGS] as const
    };
  },

  getDepartments() {
    return {
      path: SETTINGS.DEPARTMENTS,
      keys: () => [SETTINGS.DEPARTMENTS] as const
    };
  }
};
