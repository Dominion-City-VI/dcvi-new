type TSMSLogItem = {
  userId: string;
  to: string;
  message: string;
  status: number;
  smsType: number;
  sentAt: string;
  providerMessageId: string;
  retries: number;
  id: string;
  createdAt: string;
  updatedAt: string;
};

type TSMSLogQuery = TGeneralQuery & {
  UserId: string;
  SMSLogsId: string;
  Search: string;
  SMSStatus: number;
  SMSType: number;
  CreatedAt: string;
  SentAt: string;
};
