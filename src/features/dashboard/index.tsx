import { Main } from '@/components/layout/main';
import { useStore } from '@/store';
import { observer } from 'mobx-react-lite';
import DynamicDB from './DynamicDB';

const Dashboard = () => {
  const {
    AuthStore: { activeRole }
  } = useStore();

  return (
    <>
      <Main>
        <DynamicDB {...{ role: activeRole }} />
      </Main>
    </>
  );
};

export default observer(Dashboard);
