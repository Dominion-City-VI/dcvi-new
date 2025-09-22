import { SMS } from '@/constants/api';
import { TSendSMSSchema } from '@/features/messaging/sms/validation';
import dcviServer from '@/servers/dcvi';

export const postSMS = (payload: TSendSMSSchema) => {
  const to = payload.to.split(',');
  const newPayload = {
    userId: payload.userId,
    sms: payload.sms,
    to
  };

  if (to.length == 1) {
    return dcviServer.post(SMS.SEND, { ...newPayload, to: to[0] });
  }
  return dcviServer.post(SMS.BULK_SEND, newPayload);
};
