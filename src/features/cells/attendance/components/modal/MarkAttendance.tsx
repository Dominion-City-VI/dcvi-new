import { DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { XModal } from '@/components/modals';
import { useStore } from '@/store';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField } from '@/components/ui/form';
import InputSelect from '@/components/fields/InputSelect';
import { allAttendance } from '@/utils/attendance';
import InputField from '@/components/fields/InputField';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postMarkAttendance } from '@/requests/cell';
import { useStyledToast } from '@/hooks/custom/useStyledToast';
import { Loader } from 'lucide-react';
import { ATTENDANCE } from '@/constants/api';
import { parseError } from '@/utils/errorHandler';

const MeetingType = z
  .object({
    attendanceStatus: z.string({ required_error: 'select a status...' }),
    reason: z.string().trim().optional()
  })
  .superRefine((data, ctx) => {
    const { attendanceStatus, reason } = data;

    if (attendanceStatus != '1' && attendanceStatus != '3') {
      if (!reason) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['reason'],
          message: 'Reason is required'
        });
      }
    }
  });

export const MarkAttendanceSchema = z.object({
  id: z.string(),
  memberId: z.string(),
  tuesdayService: MeetingType,
  cellMeeting: MeetingType,
  sundayMeeting: MeetingType,
  isAttendaceUpdate: z.boolean(),
  sundayServiceDate: z.string(),
  tuesdayServiceDate: z.string(),
  cellMeetingDate: z.string()
});

export type TMarkAttendanceSchema = z.infer<typeof MarkAttendanceSchema>;

export default function MarkAttendanceModal() {
  const toast = useStyledToast();
  const {
    AuthStore: { userExtraInfo },
    AppConfigStore: { toggleModals, isOpen, attendance }
  } = useStore();

  const { id, isAttendaceUpdate, tuesdayServiceDate, cellMeetingDate, sundayServiceDate } =
    attendance;

  const queryClient = useQueryClient();

  const form = useForm<TMarkAttendanceSchema>({
    defaultValues: {
      id: userExtraInfo.cellId,
      memberId: id,
      tuesdayServiceDate: tuesdayServiceDate ?? '',
      cellMeetingDate: cellMeetingDate ?? '',
      sundayServiceDate: sundayServiceDate ?? '',
      isAttendaceUpdate: true
    },
    mode: 'onSubmit',
    resolver: zodResolver(MarkAttendanceSchema),
    reValidateMode: 'onChange'
  });

  const { mutate, isPending } = useMutation({
    mutationFn: postMarkAttendance,
    onError: (error) => {
      toast.error(parseError(error));
    },
    onSuccess: () => {
      toast.success('Attendance Marked!');
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === ATTENDANCE.GET });
      toggleModals();
    }
  });

  const onSubmit = (data: TMarkAttendanceSchema) => {
    mutate(data);
  };

  return (
    <XModal isOpen={isOpen.MARK_ATTENDANCE_MODAL} closeModal={() => toggleModals({})}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-6">
          <DialogTitle>Mark user attendance</DialogTitle>
          <DialogDescription>
            Record the user's attendance for the selected session or date. You can update or modify
            this entry later if needed.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="attendance-form" onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={isPending} className="flex flex-col space-y-6">
              <div className="flex flex-col space-y-1">
                <FormField
                  control={form.control}
                  name="tuesdayService.attendanceStatus"
                  render={({ field }) => (
                    <InputSelect
                      {...field}
                      label="Tuesday meeting"
                      items={allAttendance()}
                      placeholder="Select attendance..."
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      required
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="tuesdayService.reason"
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="Reason"
                      placeholder="Give a reason..."
                      defaultValue={field.value}
                    />
                  )}
                />
              </div>

              <div className="flex flex-col space-y-1">
                <FormField
                  control={form.control}
                  name="cellMeeting.attendanceStatus"
                  render={({ field }) => (
                    <InputSelect
                      {...field}
                      label="Cell Meeting"
                      items={allAttendance()}
                      placeholder="Select attendance..."
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      required
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="cellMeeting.reason"
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label={'reason'}
                      placeholder="Give a reason..."
                      defaultValue={field.value}
                    />
                  )}
                />
              </div>

              <div className="flex flex-col space-y-1">
                <FormField
                  control={form.control}
                  name="sundayMeeting.attendanceStatus"
                  render={({ field }) => (
                    <InputSelect
                      {...field}
                      label="Sunday Meeting"
                      items={allAttendance()}
                      placeholder="Select attendance..."
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      required
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="sundayMeeting.reason"
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label={'reason'}
                      placeholder="Give a reason..."
                      defaultValue={field.value}
                    />
                  )}
                />
              </div>
            </fieldset>
          </form>
        </Form>

        <DialogFooter className="sm:justify-end">
          <DialogClose disabled={isPending} asChild>
            <Button disabled={isPending} type="button" variant="secondary">
              close
            </Button>
          </DialogClose>
          <Button disabled={isPending} form="attendance-form" type="submit">
            {isPending && <Loader className="animate-spin" />}
            Mark attendance
          </Button>
        </DialogFooter>
      </DialogContent>
    </XModal>
  );
}
