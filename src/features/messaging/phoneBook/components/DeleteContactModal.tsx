import { DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { DialogHeader, DialogFooter } from '../../../../components/ui/dialog';
import { XModal } from '../../../../components/modals';
import { useStore } from '@/store';
import { Loader } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteContact } from '@/requests/phonebook';
import { toast } from 'sonner';
import { PHONEBOOK } from '@/constants/api';

export default function DeleteContactModal() {
  const {
    AppConfigStore: { toggleModals, isOpen, deleteModal }
  } = useStore();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteContact,
    onError: () => {
      toast.error('Error delete Phonebook!');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] == PHONEBOOK.GET_USER_PHONEBOOK
      });
      toast.success(data.data.message);
      toggleModals({});
    }
  });

  return (
    <XModal isOpen={isOpen.DELETE_CONTACT_MODAL} closeModal={() => isPending || toggleModals({})}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-6">
          <DialogTitle>Ready to Delete?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this resource. You won't be able to get it back once
            deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild disabled={isPending}>
            <Button type="button" variant="secondary">
              close
            </Button>
          </DialogClose>
          <Button
            disabled={isPending}
            type="button"
            variant="destructive"
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
