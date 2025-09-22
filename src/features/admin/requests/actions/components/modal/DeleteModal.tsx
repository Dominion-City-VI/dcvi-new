import { DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { XModal } from '@/components/modals';
import { useStore } from '@/store';
import { useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { ADMIN } from '@/constants/api';
import { observer } from 'mobx-react-lite';
import { EnumActionRequestType } from '@/constants/mangle';
import { actionRequestTypes } from '../data/data';
import { cn } from '@/lib/utils';
import { getActionReqTypeText } from '@/utils/actions';
import { Badge } from '@/components/ui/badge';
import LongText from '@/components/LongText';

function MergeModal() {
  const {
    AppConfigStore: { toggleModals, isOpen, mergeModal },
    AdminStore: { mergeRequest, isLoading }
  } = useStore();

  const queryClient = useQueryClient();

  const onSubmit = () => {
    const cb = () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === ADMIN.GET_ANALYTICS
      });
      toggleModals();
    };
    const type = mergeModal.requestType === EnumActionRequestType.CELL_MERGE ? 'cell' : 'zone';
    mergeRequest({ unmapFromId: mergeModal.unmapFromId, mapToId: mergeModal.mapToId }, type, cb);
  };

  const badgeColor = actionRequestTypes.get(mergeModal.requestType);

  return (
    <XModal isOpen={isOpen.MERGE_REQUEST_MODAL} closeModal={() => toggleModals({})}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-6">
          <DialogTitle>Merging Request</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-3">
            <div className="">
              <Badge variant="outline" className={cn('capitalize', badgeColor)}>
                {getActionReqTypeText(mergeModal.requestType)}
              </Badge>
            </div>

            <div>
              {mergeModal.requestorComments.map((el) => (
                <div key={el} className="gap-2 p-2">
                  <LongText className="flex flex-col overflow-hidden text-xs text-ellipsis whitespace-nowrap">
                    {el}
                  </LongText>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose disabled={isLoading.mergeRequest} asChild>
            <Button disabled={isLoading.mergeRequest} type="button" variant="secondary">
              close
            </Button>
          </DialogClose>
          <Button disabled={isLoading.mergeRequest} type="button" onClick={onSubmit}>
            {isLoading.mergeRequest && <Loader className="animate-spin" />}
            Merge
          </Button>
        </DialogFooter>
      </DialogContent>
    </XModal>
  );
}

export default observer(MergeModal);
