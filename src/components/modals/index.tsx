import { Dialog } from '@/components/ui/dialog';

interface IXModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  closeModal: () => void;
}

export const XModal = ({ children, isOpen, closeModal }: IXModalProps) => {
  return (
    <Dialog modal={isOpen} open={isOpen} onOpenChange={() => closeModal()}>
      {children}
    </Dialog>
  );
};
