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
  }
];

export const gender: Array<Option> = [
  {
    label: 'Male',
    value: '1'
  },
  {
    label: 'Female',
    value: '2'
  }
];

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
