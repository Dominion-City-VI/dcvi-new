import { DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { XModal } from '@/components/modals';
import { useStore } from '@/store';

export default function DeleteZoneModal() {
  const {
    AppConfigStore: { toggleModals, isOpen }
  } = useStore();
  return (
    <XModal isOpen={isOpen.REQUEST_ZONE_DELETE_MODAL} closeModal={() => toggleModals({})}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-6">
          <DialogTitle>Ready to delete zone?</DialogTitle>
          <DialogDescription>Your request to delete zone will be sent to admin.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              close
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={() => {}}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </XModal>
  );
}
