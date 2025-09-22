import { DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { XModal } from '@/components/modals';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useStore } from '@/store';
import { delCellMember } from '@/requests/cell';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { CELL } from '@/constants/api';

export default function DeleteMemberModal() {
  const {
    AppConfigStore: { toggleModals, isOpen, deleteModal }
  } = useStore();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: delCellMember,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === CELL.GET
      });
      toast.success(data.data.message);
      toggleModals({});
    }
  });

  return (
    <XModal isOpen={isOpen.DELETE_MEMBER_MODAL} closeModal={() => toggleModals({})}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-6">
          <DialogTitle>Ready to delete member?</DialogTitle>
          <DialogDescription>
            Your request to delete member will be sent to admin.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild disabled={isPending}>
            <Button type="button" variant="secondary">
              close
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={() => mutate(deleteModal.resourceId)}
          >
            {isPending && <Loader className="animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </XModal>
  );
}
