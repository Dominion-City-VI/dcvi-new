import { DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { DialogHeader, DialogFooter } from '../ui/dialog';
import { XModal } from '.';
import { useStore } from '@/store';

export default function DoneModal() {
  const {
    AppConfigStore: { toggleModals, isOpen, doneModal }
  } = useStore();
  return (
    <XModal isOpen={isOpen.DONE} closeModal={() => toggleModals({})}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{doneModal.text}</DialogTitle>
          <DialogDescription>{doneModal.subText}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {doneModal.ctaText}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </XModal>
  );
}
