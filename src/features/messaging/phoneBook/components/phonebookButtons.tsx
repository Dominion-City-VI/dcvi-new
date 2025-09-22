import { IconDownload } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
import { AppModals } from '@/store/AppConfig/appModalTypes';

function PhoneBookPrimaryButtons() {
  const {
    AppConfigStore: { toggleModals }
  } = useStore();
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => toggleModals({ name: AppModals.IMPORT_PHONEBOOK, open: true })}
        className="space-x-1"
      >
        <span>Import</span> <IconDownload size={18} />
      </Button>
    </div>
  );
}

export default observer(PhoneBookPrimaryButtons);
