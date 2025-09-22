import { PHONEBOOK } from '@/constants/api';

export const phoneBook = {
  getUserPhoneBooks: (query: Partial<TGetPhonebookQuery>) => {
    return {
      path: PHONEBOOK.GET_USER_PHONEBOOK,
      keys: () => [PHONEBOOK.GET_USER_PHONEBOOK, query] as const,
      params: query
    };
  },

  getPhonebookContacts: (id: string) => {
    return {
      path: PHONEBOOK.GET_PHONEBOOK_CONTACTS.replace(':id', id),
      keys: () => [
        PHONEBOOK.GET_USER_PHONEBOOK,
        PHONEBOOK.GET_USER_PHONEBOOK,
        PHONEBOOK.GET_PHONEBOOK_CONTACTS,
        id
      ]
    };
  }
};
