type TGetPhonebookQuery = {
  UserId: string;
  Search: string;
};

type TUploadPhonebookPayload = {
  Name: string;
  File: File;
};

type TPhonebookEntryItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  phoneNumber: string;
  phoneBookId: string;
};

type TGetPhonebookResp = {
  id: string;
  name: string;
  count: number;
  userId: string;
};

type TPhonebookContacts = {
  name: string;
  phoneNumber: string;
  phoneBookId: string;
  id: string;
  createdAt: string;
  updatedAt: string;
};

type TGetPhonebookContactsResp = {
  name: string;
  entries: Array<TPhonebookContacts>;
};
