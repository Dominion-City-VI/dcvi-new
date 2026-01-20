import { EnumCellType } from './mangle';

export const maritalStatus: Array<Option> = [
  {
    label: 'Single',
    value: '0'
  },
  {
    label: 'Married',
    value: '1'
  },
  {
    label: 'Divorced',
    value: '2'
  },
  {
    label: 'Widowed',
    value: '3'
  },
  {
    label: 'Unknown',
    value: '4'
  }
];

export const gender: Array<Option> = [
  {
    label: 'Unknown',
    value: '0'
  },
  {
    label: 'Male',
    value: '1'
  },
  {
    label: 'Female',
    value: '2'
  }
];

export const userStatus: Array<Option> = [
  {
    label: 'Active',
    value: '0'
  },
  {
    label: 'Pending',
    value: '1'
  },
  {
    label: 'Deleted',
    value: '2'
  },
  {
    label: 'Blocked',
    value: '3'
  },
  {
    label: 'LockedOut',
    value: '4'
  }
];

export const statusMap: Record<string, string> = {
  '0': 'Active',
  '1': 'Pending',
  '2': 'Deleted',
  '3': 'Blocked',
  '4': 'LockedOut'
};

export const trueOfFalse: Array<Option> = [
  {
    label: 'Yes',
    value: 'true'
  },
  {
    label: 'No',
    value: 'false'
  }
];

export const cellTypeOptions: Array<Option> = [
  {
    label: 'conventional',
    value: String(EnumCellType.CONVENTIONAL.toString())
  },
  {
    label: 'Professional',
    value: String(EnumCellType.PROFESSIONAL)
  }
];

export const paginatedRes: TPaginatedRes = {
  currentPage: 0,
  totalItems: 0,
  totalPages: 0,
  pathUrl: '',
  previousPageUrl: '',
  nextPageUrl: ''
};
