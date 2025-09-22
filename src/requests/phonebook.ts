import { PHONEBOOK } from '@/constants/api';
import dcviServer from '@/servers/dcvi';

// post requests
export const postImportPhonebook = (payload: TUploadPhonebookPayload) =>
  dcviServer.post<IDCVIServerRes<boolean>>(PHONEBOOK.IMPORT, payload, {
    headers: {
      'content-type': 'multipart/form-data'
    }
  });

export const postAddContact = ({
  id,
  payload
}: {
  id: string;
  payload: { name: string; phoneNumber: string };
}) => dcviServer.post<IDCVIServerRes<boolean>>(PHONEBOOK.ADD_CONTACT.replace(':id', id), payload);

// delete requests
export const deletePhonebook = (id: string) =>
  dcviServer.delete(PHONEBOOK.DELETE_PHONEBOOK.replace(':id', id));

export const deleteContact = (id: string) =>
  dcviServer.delete(PHONEBOOK.DELETE_CONTACT.replace(':id', id));
