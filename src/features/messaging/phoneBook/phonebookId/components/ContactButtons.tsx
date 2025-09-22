import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store';
import { AppModals } from '@/store/AppConfig/appModalTypes';
import { observer } from 'mobx-react-lite';

interface IPBContactPrimaryButtonsProps {
  id: string;
  book: string;
}

const PBContactPrimaryButtons = ({ id, book }: IPBContactPrimaryButtonsProps) => {
  const {
    AppConfigStore: { toggleModals }
  } = useStore();
  return (
    <div className="flex gap-2">
      <Button
        className="space-x-1"
        onClick={() => toggleModals({ open: true, name: AppModals.ADD_CONTACT_MODAL, id, book })}
      >
        <span>Add</span> <IconPlus size={18} />
      </Button>
    </div>
  );
};

export default observer(PBContactPrimaryButtons);
