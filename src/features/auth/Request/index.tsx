import { cn } from '@/lib/utils';
import PersonalForm from './PersonalForm';
import { REQUEST_FORM } from '@/constants/mangle';
import OthersForm from './OthersForm';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';

const RegisterForm = ({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) => {
  const {
    AuthStore: { requestForm }
  } = useStore();
  const renderForm = (current_form: REQUEST_FORM) => {
    switch (current_form) {
      case REQUEST_FORM.PERSONAL:
        return <PersonalForm />;
      case REQUEST_FORM.OTHERS:
        return <OthersForm />;
      default:
        return <></>;
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      {renderForm(requestForm)}
    </div>
  );
};

export default observer(RegisterForm);
