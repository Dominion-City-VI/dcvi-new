import { SMS } from '@/constants/api';

export const sms = {
  getSMSLog(query: Partial<TSMSLogQuery>) {
    return {
      path: SMS.LOGS,
      keys: () => [SMS.LOGS, query] as const,
      params: query
    };
  }
};
