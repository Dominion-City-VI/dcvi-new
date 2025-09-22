//#region  Old code now replaced but leave for future ref
//   import { DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
//   import { Button } from '@/components/ui/button';
//   import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
//   import { XModal } from '@/components/modals';
//   import { useStore } from '@/store';
//   import { z } from 'zod';
//   import { useForm } from 'react-hook-form';
//   import { zodResolver } from '@hookform/resolvers/zod';
//   import { Form, FormField } from '@/components/ui/form';
//   import InputField from '@/components/fields/InputField';
//   import { useQueryClient } from '@tanstack/react-query';
//   import { Loader } from 'lucide-react';
//   import { ADMIN } from '@/constants/api';
//   import { observer } from 'mobx-react-lite';
//   import { EnumActionRequestStatus } from '@/constants/mangle';
//   import { actionRequestTypes } from '../data/data';
//   import { cn } from '@/lib/utils';
//   import { getActionReqTypeText } from '@/utils/actions';
//   import { Badge } from '@/components/ui/badge';
//   import LongText from '@/components/LongText';
// import { act } from 'react';

//   export const ActionRequestSchema = z.object({
//     requestStatus: z.number({ required_error: 'request status is required.' }),
//     id: z.string(),
//     comment: z.string({ required_error: 'Provide a comment.' })
//   });

//   export type TActionRequestSchema = z.infer<typeof ActionRequestSchema>;

//   function ActionModal() {
//     const {
//       AppConfigStore: { toggleModals, isOpen, actionRequestModal },
//       AdminStore: { approveRejectAccess, isLoading }
//     } = useStore();

//     const queryClient = useQueryClient();

//     const form = useForm<TActionRequestSchema>({
//       defaultValues: { id: actionRequestModal.id, requestStatus: actionRequestModal.requestStatus, comment: actionRequestModal.requestorComments[0] },
//       mode: 'onSubmit',
//       resolver: zodResolver(ActionRequestSchema),
//       reValidateMode: 'onChange'
//     });

//     const onSubmit = (data: TActionRequestSchema) => {
//       const cb = () => {
//         queryClient.invalidateQueries({
//           predicate: (query) => query.queryKey[0] === ADMIN.GET_ANALYTICS
//         });
//         toggleModals();
//       };

//       approveRejectAccess(data, cb);
//     };

//     // const badgeColor = actionRequestTypes.get(actionRequestModal.requestType);
//     const badgeColor = actionRequestTypes.get(actionRequestModal.requestType);
//   const isPending = actionRequestModal.requestStatus === EnumActionRequestStatus.PENDING;
//   const isApproved = actionRequestModal.requestStatus === EnumActionRequestStatus.APPROVED;
//   const isRejected = actionRequestModal.requestStatus === EnumActionRequestStatus.REJECTED;


//     return (
//       <XModal isOpen={isOpen.ACTION_REQUEST_MODAL} closeModal={() => toggleModals({})}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader className="mb-6">
//             <DialogTitle>
//               {actionRequestModal.requestStatus === EnumActionRequestStatus.APPROVED && 'Approve'}
//               {actionRequestModal.requestStatus === EnumActionRequestStatus.REJECTED && 'Reject'}
//               &nbsp; Action
//             </DialogTitle>
//           </DialogHeader>

//           <Form {...form}>
//             <form id="attendance-form" onSubmit={form.handleSubmit(onSubmit)}>
//               <fieldset disabled={isLoading.updateRole} className="flex flex-col space-y-6">
//                 <div className="flex flex-col space-y-3">
//                   <div className="">
//                     <Badge variant="outline" className={cn('capitalize', badgeColor)}>
//                       {getActionReqTypeText(actionRequestModal.requestType)}
//                     </Badge>
//                   </div>

//                   <div>
//                     {actionRequestModal.requestorComments.map((el) => (
//                       <div key={el} className="gap-2 p-2">
//                         <LongText className="flex flex-col overflow-hidden text-xs text-ellipsis whitespace-nowrap">
//                           <small className="">{el}</small>
//                         </LongText>
//                       </div>
//                     ))}
//                   </div>

//                   <FormField
//                     control={form.control}
//                     name="comment"
//                     render={({ field }) => (
//                       <InputField
//                         {...field}
//                         label="Comment"
//                         placeholder="Give a short comment..."
//                         defaultValue={field.value}
//                       />
//                     )}
//                   />
//                 </div>
//               </fieldset>
//             </form>
//           </Form>

//           <DialogFooter className="sm:justify-end">
//             <DialogClose disabled={isLoading.approveRejectAccess} asChild>
//               <Button disabled={isLoading.approveRejectAccess} type="button" variant="secondary">
//                 close
//               </Button>
//             </DialogClose>
//             {(actionRequestModal.requestStatus === EnumActionRequestStatus.PENDING || actionRequestModal.requestStatus === EnumActionRequestStatus.REJECTED) && (
//               <Button disabled={isLoading.approveRejectAccess} form="attendance-form" type="submit">
//                 {isLoading.approveRejectAccess && <Loader className="animate-spin" />}
//                 Approve
//               </Button>
//             )}
//             {(actionRequestModal.requestStatus === EnumActionRequestStatus.APPROVED || actionRequestModal.requestStatus === EnumActionRequestStatus.REJECTED) && (
//               <Button
//                 disabled={isLoading.approveRejectAccess}
//                 form="attendance-form"
//                 type="submit"
//                 variant="destructive"
//               >
//                 {isLoading.approveRejectAccess && <Loader className="animate-spin" />}
//                 Reject
//               </Button>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </XModal>
//     );
//   }

//   export default observer(ActionModal);
//#endregion

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
  comment: z.string({ required_error: 'Provide a comment.' })
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
      comment: actionRequestModal.requestorComments[0] 
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

        <DialogFooter className="sm:justify-end">
          <DialogClose disabled={isLoading.approveRejectAccess} asChild>
            <Button disabled={isLoading.approveRejectAccess} type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          
          {/* Show both approve and reject buttons for pending requests */}
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
          
          {/* Show reject button for approved requests (to change to rejected) */}
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
          
          {/* Show approve button for rejected requests (to change to approved) */}
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
        </DialogFooter>
      </DialogContent>
    </XModal>
  );
}

export default observer(ActionModal);