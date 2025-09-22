import { sidebarData } from '@/components/layout/data/sidebar-data';

export function getInitials(word: string) {
  const charArr = word.split(' ').map((w) => w.charAt(0));
  return charArr.join('');
}

export function fmtNumber(num: number) {
  return new Intl.NumberFormat().format(num);
}

export function formatAccNumber(accNumber: string) {
  return `****${accNumber.slice(-2)}`;
}

export function truncate(text: string, maxLength: number) {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
}

export const lowerCaseRegex = /(?=.*[a-z])\w+/;
export const upperCaseRegex = /(?=.*[A-Z])\w+/;
export const numberRegex = /\d/;
export const specialCharcterRegex = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
export const handleCharcterRegex = /[`@?&=]/;

export const ISSERVER = typeof window === 'undefined';

export function toTitleCase(p: string) {
  if (p.includes('_')) {
    return snakeCaseToSentenceCase(p);
  }

  return `${p[0].toUpperCase()}${p.slice(1).toLowerCase()}`;
}

export function snakeCaseToSentenceCase(input: string): string {
  const words = input.split('_');

  const sentence = words
    .map((word, index) =>
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word.toLowerCase()
    )
    .join(' ');

  return sentence;
}

export function trnformToOptions(arg: Array<string>) {
  return arg.map((arg) => ({ label: arg, value: arg }));
}

export function getLabel(
  value: string,
  arr: Array<{
    label: string;
    value: string;
  }>
) {
  return arr.find((arg) => arg.value === value)?.value as string;
}

export function hasCommonRole(roles: Array<number>, array2: Array<number>) {
  if (array2.length == 0) {
    return true;
  } else {
    return roles.some((element) => array2.includes(element));
  }
}

export const otherRoles = (roles: Array<number>) =>
  sidebarData.roleSwitcher.filter((role) => !roles.includes(role.value));
