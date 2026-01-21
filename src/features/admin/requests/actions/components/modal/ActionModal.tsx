import { DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { XModal } from '@/components/modals';
import { useStore } from '@/store';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField } from '@/components/ui/form';
import InputField from '@/components/fields/InputField';
import { useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { ADMIN } from '@/constants/api';
import { observer } from 'mobx-react-lite';
import { EnumActionRequestStatus } from '@/constants/mangle';
import { actionRequestTypes } from '../data/data';
import { cn } from '@/lib/utils';
import { getActionReqTypeText } from '@/utils/actions';
import { Badge } from '@/components/ui/badge';
import LongText from '@/components/LongText';

export const ActionRequestSchema = z.object({
  requestStatus: z.number({ required_error: 'request status is required.' }),
  id: z.string(),
  comment: z.string({ required_error: 'Provide a comment.' }),
  subActionId: z.string(),
});

export type TActionRequestSchema = z.infer<typeof ActionRequestSchema>;

function ActionModal() {
  const {
    AppConfigStore: { toggleModals, isOpen, actionRequestModal },
    AdminStore: { approveRejectAccess, isLoading }
  } = useStore();

  const queryClient = useQueryClient();

  const form = useForm<TActionRequestSchema>({
    defaultValues: { 
      id: actionRequestModal.id, 
      requestStatus: actionRequestModal.requestStatus, 
      comment: actionRequestModal.requestorComments[0],
      subActionId: actionRequestModal.subActionId
    },
    mode: 'onSubmit',
    resolver: zodResolver(ActionRequestSchema),
    reValidateMode: 'onChange'
  });

  const onApprove = () => {
    const data = {
      ...form.getValues(),
      requestStatus: EnumActionRequestStatus.APPROVED
    };
    
    const cb = () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === ADMIN.GET_ANALYTICS
      });
      toggleModals();
    };

    approveRejectAccess(data, cb);
  };

  const onReject = () => {
    const data = {
      ...form.getValues(),
      requestStatus: EnumActionRequestStatus.REJECTED
    };
    
    const cb = () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === ADMIN.GET_ANALYTICS
      });
      toggleModals();
    };

    approveRejectAccess(data, cb);
  };

  const badgeColor = actionRequestTypes.get(actionRequestModal.requestType);
  const isPending = actionRequestModal.requestStatus === EnumActionRequestStatus.PENDING;
  const isApproved = actionRequestModal.requestStatus === EnumActionRequestStatus.APPROVED;
  const isRejected = actionRequestModal.requestStatus === EnumActionRequestStatus.REJECTED;

  return (
    <XModal isOpen={isOpen.ACTION_REQUEST_MODAL} closeModal={() => toggleModals({})}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-6">
          <DialogTitle>Action Request</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form id="attendance-form">
            <fieldset disabled={isLoading.approveRejectAccess} className="flex flex-col space-y-6">
              <div className="flex flex-col space-y-3">
                <div className="">
                  <Badge variant="outline" className={cn('capitalize', badgeColor)}>
                    {getActionReqTypeText(actionRequestModal.requestType)}
                  </Badge>
                </div>

                <div>
                  {actionRequestModal.requestorComments.map((el) => (
                    <div key={el} className="gap-2 p-2">
                      <LongText className="flex flex-col overflow-hidden text-xs text-ellipsis whitespace-nowrap">
                        <small className="">{el}</small>
                      </LongText>
                    </div>
                  ))}
                </div>

                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="Comment"
                      placeholder="Give a short comment..."
                      defaultValue={field.value}
                    />
                  )}
                />
              </div>
            </fieldset>
          </form>
        </Form>

        {/* <DialogFooter className="sm:justify-end">
          <DialogClose disabled={isLoading.approveRejectAccess} asChild>
            <Button disabled={isLoading.approveRejectAccess} type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          
          {isPending && (
            <>
              <Button 
                disabled={isLoading.approveRejectAccess} 
                type="button"
                onClick={onApprove}
              >
                {isLoading.approveRejectAccess && <Loader className="animate-spin" />}
                Approve
              </Button>
              <Button 
                disabled={isLoading.approveRejectAccess} 
                type="button"
                variant="destructive"
                onClick={onReject}
              >
                {isLoading.approveRejectAccess && <Loader className="animate-spin" />}
                Reject
              </Button>
            </>
          )}
          
          {isApproved && (
            <Button 
              disabled={isLoading.approveRejectAccess} 
              type="button"
              variant="destructive"
              onClick={onReject}
            >
              {isLoading.approveRejectAccess && <Loader className="animate-spin" />}
              Reject
            </Button>
          )}
          
          {isRejected && (
            <Button 
              disabled={isLoading.approveRejectAccess} 
              type="button"
              onClick={onApprove}
            >
              {isLoading.approveRejectAccess && <Loader className="animate-spin" />}
              Approve
            </Button>
          )}
        </DialogFooter> */}

        <DialogFooter className="sm:justify-end">
          <DialogClose disabled={isLoading.approveRejectAccess} asChild>
            <Button disabled={isLoading.approveRejectAccess} type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>

          {/* Pending: show both buttons (clickable) */}
          {isPending && (
            <>
              <Button
                disabled={isLoading.approveRejectAccess}
                type="button"
                onClick={onApprove}
              >
                {isLoading.approveRejectAccess && <Loader className="animate-spin" />}
                Approve
              </Button>

              <Button
                disabled={isLoading.approveRejectAccess}
                type="button"
                variant="destructive"
                onClick={onReject}
              >
                {isLoading.approveRejectAccess && <Loader className="animate-spin" />}
                Reject
              </Button>
            </>
          )}

          {/* Approved: show only Approve (disabled) */}
          {isApproved && (
            <Button disabled type="button">
              Approved
            </Button>
          )}

          {/* Rejected: show only Reject (disabled) */}
          {isRejected && (
            <Button disabled type="button" variant="destructive">
              Rejected
            </Button>
          )}
        </DialogFooter>

      </DialogContent>
    </XModal>
  );
}

export default observer(ActionModal);