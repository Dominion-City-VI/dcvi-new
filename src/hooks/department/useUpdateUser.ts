import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserInfo } from '../../requests/department';

type TUpdateUserPayload = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  trainings: string[];
  departments: string[];
  occupation: string;
  address?: string;
  gender: number;
  maritalStatus: number;
  zoneId?: string;
  cellId?: string;
  status?: number;
  dateOfBirth?: Date;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: TUpdateUserPayload }) =>
      updateUserInfo({ userId, payload }),
    onSuccess: (data, variables) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
    },
  });
};