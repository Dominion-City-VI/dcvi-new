import { Loader } from 'lucide-react';

const PageLoading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader className="animate-spin" />
        <p className="text-gray-500 dark:text-gray-400">Dominion City VI...</p>
      </div>
    </div>
  );
};

export default PageLoading;
