import { DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { DialogHeader, DialogFooter } from '../ui/dialog';
import { XModal } from '.';
import { useStore } from '@/store';
import { Loader } from 'lucide-react';

export default function LogoutModal() {
  const {
    AuthStore: { logout, isLoading },
    AppConfigStore: { toggleModals, isOpen }
  } = useStore();
  return (
    <XModal isOpen={isOpen.LOG_OUT_MODAL} closeModal={() => toggleModals({})}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-6">
          <DialogTitle>Ready to Log Out?</DialogTitle>
          <DialogDescription>No worries, we can get you back in easily.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild disabled={isLoading.logout}>
            <Button type="button" variant="secondary">
              close
            </Button>
          </DialogClose>
          <Button
            disabled={isLoading.logout}
            type="button"
            variant="destructive"
            onClick={() => logout()}
          >
            {isLoading.logout && <Loader className="animate-spin" />}
            log out
          </Button>
        </DialogFooter>
      </DialogContent>
    </XModal>
  );
}
