//import { useEffect } from 'react';
import { DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { XModal } from '@/components/modals';
import { useStore } from '@/store';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormMessage } from '@/components/ui/form';
import InputSelect from '@/components/fields/InputSelect';
import { allAttendance } from '@/utils/attendance';
import InputField from '@/components/fields/InputField';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postMarkAttendance } from '@/requests/department';
import { useStyledToast } from '@/hooks/custom/useStyledToast';
import { Loader } from 'lucide-react';
import { ATTENDANCE } from '@/constants/api';
import { parseError } from '@/utils/errorHandler';
import { AxiosError } from 'axios';
import { observer } from 'mobx-react-lite';

const MeetingType = z
  .object({
    attendanceStatus: z.string({ required_error: 'Select a status' }),
    reason: z.string().trim().optional()
  })
  .superRefine((data, ctx) => {
    const { attendanceStatus, reason } = data;

    // If status is not "Present" (1) or "Unmarked" (3), reason is required
    if (attendanceStatus !== '1' && attendanceStatus !== '3') {
      if (!reason || reason.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['reason'],
          message: 'Reason is required for this attendance status'
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
  cellMeetingDate: z.string(),
  departmentId: z.string()
});

export type TMarkAttendanceSchema = z.infer<typeof MarkAttendanceSchema>;

function MarkAttendanceModal() {
  const toast = useStyledToast();
  const {
    AuthStore: { userExtraInfo },
    AppConfigStore: { toggleModals, isOpen, departmentAttendance }
  } = useStore();

  const queryClient = useQueryClient();

  const { 
    id = '', 
    tuesdayServiceDate = '', 
    cellMeetingDate = '', 
    sundayServiceDate = ''
  } = departmentAttendance;

  const form = useForm<TMarkAttendanceSchema>({
    defaultValues: {
      id: userExtraInfo?.departmentId || '',
      memberId: id,
      tuesdayServiceDate: tuesdayServiceDate ?? '',
      cellMeetingDate: cellMeetingDate ?? '',
      sundayServiceDate: sundayServiceDate ?? '',
      isAttendaceUpdate: true,
      departmentId: userExtraInfo?.departmentId || '',
      tuesdayService: {
        attendanceStatus: '',
        reason: ''
      },
      cellMeeting: {
        attendanceStatus: '',
        reason: ''
      },
      sundayMeeting: {
        attendanceStatus: '',
        reason: ''
      }
    },
    mode: 'onSubmit',
    resolver: zodResolver(MarkAttendanceSchema),
    reValidateMode: 'onChange'
  });

  const { mutate, isPending } = useMutation({
    mutationFn: postMarkAttendance,
    onError: (error: AxiosError<any>) => {
      toast.error(parseError(error));
    },
    onSuccess: () => {
      toast.success('Attendance marked successfully!');
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === ATTENDANCE.FETCH_DEPARTMENT_ATTENDANCE 
      });
      form.reset();
      toggleModals({});
    }
  });

  const onSubmit = (data: TMarkAttendanceSchema) => {
    console.log('Submitting attendance data:', data);
    mutate(data);
  };

  const onError = (errors: any) => {
    console.error('Form validation errors:', errors);
    toast.error('Please fill in all required fields correctly');
  };

  return (
    <XModal 
      isOpen={isOpen.DEPARTMENT_MARK_ATTENDANCE_MODAL} 
      closeModal={() => toggleModals({})}
    >
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-6">
          <DialogTitle>Mark Member Attendance</DialogTitle>
          <DialogDescription>
            Record the member's attendance for Tuesday service, cell meeting, and Sunday service. 
            You can update this entry later if needed.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="attendance-form" onSubmit={form.handleSubmit(onSubmit, onError)}>
            <fieldset disabled={isPending} className="flex flex-col space-y-6">
              {/* Tuesday Service */}
              <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                <h3 className="font-semibold text-sm">Tuesday Service</h3>
                <FormField
                  control={form.control}
                  name="tuesdayService.attendanceStatus"
                  render={({ field }) => (
                    <div className="space-y-1">
                      <InputSelect
                        {...field}
                        label="Attendance Status"
                        items={allAttendance()}
                        placeholder="Select attendance status..."
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        required
                      />
                      <FormMessage />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tuesdayService.reason"
                  render={({ field }) => (
                    <div className="space-y-1">
                      <InputField
                        {...field}
                        label="Reason (if absent/excused)"
                        placeholder="Provide a reason..."
                        defaultValue={field.value}
                      />
                      <FormMessage />
                    </div>
                  )}
                />
              </div>

              {/* Cell Meeting */}
              <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                <h3 className="font-semibold text-sm">Cell Meeting</h3>
                <FormField
                  control={form.control}
                  name="cellMeeting.attendanceStatus"
                  render={({ field }) => (
                    <div className="space-y-1">
                      <InputSelect
                        {...field}
                        label="Attendance Status"
                        items={allAttendance()}
                        placeholder="Select attendance status..."
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        required
                      />
                      <FormMessage />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cellMeeting.reason"
                  render={({ field }) => (
                    <div className="space-y-1">
                      <InputField
                        {...field}
                        label="Reason (if absent/excused)"
                        placeholder="Provide a reason..."
                        defaultValue={field.value}
                      />
                      <FormMessage />
                    </div>
                  )}
                />
              </div>

              {/* Sunday Meeting */}
              <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                <h3 className="font-semibold text-sm">Sunday Service</h3>
                <FormField
                  control={form.control}
                  name="sundayMeeting.attendanceStatus"
                  render={({ field }) => (
                    <div className="space-y-1">
                      <InputSelect
                        {...field}
                        label="Attendance Status"
                        items={allAttendance()}
                        placeholder="Select attendance status..."
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        required
                      />
                      <FormMessage />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sundayMeeting.reason"
                  render={({ field }) => (
                    <div className="space-y-1">
                      <InputField
                        {...field}
                        label="Reason (if absent/excused)"
                        placeholder="Provide a reason..."
                        defaultValue={field.value}
                      />
                      <FormMessage />
                    </div>
                  )}
                />
              </div>
            </fieldset>
          </form>
        </Form>

        <DialogFooter className="sm:justify-end gap-2">
          <DialogClose asChild>
            <Button 
              disabled={isPending} 
              type="button" 
              variant="secondary"
              // onClick={handleCloseModal}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button 
            disabled={isPending} 
            form="attendance-form" 
            type="submit"
            className="min-w-[140px]"
          >
            {isPending && <Loader className="animate-spin mr-2" size={16} />}
            {isPending ? 'Saving...' : 'Mark Attendance'}
          </Button>
          {/* <Button disabled={isPending} form="attendance-form" type="submit">
                      {isPending && <Loader className="animate-spin" />}
                      Mark attendance
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </XModal>
  );
}

export default observer(MarkAttendanceModal);