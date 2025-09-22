import { ZodError } from 'zod';
import logger from './logger';
import { AxiosError } from 'axios';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const isAxiosError = (error: any): error is AxiosError<Partial<IDCVIServerRes<string>>> => {
  return error.isAxiosError === true;
};

export const isZodError = <T>(error: unknown): error is ZodError<T> => {
  return error instanceof ZodError;
};

export const isGenericError = (error: unknown): error is Error => {
  return error instanceof Error;
};

export function parseError<T>(error: unknown): string {
  if (!error) return '__empty__';

  if (isAxiosError(error)) {
    if (error.name === 'CanceledError') return 'Request canceled';
    if (error.response?.status === 400) return error.response.data.message || 'Bad request';
    if (Array.isArray(error.response?.data?.data)) return error.response?.data?.data[0];
    return error.response?.data?.message || 'Something went wrong. Try again later.';
  }
  if (isZodError<T>(error)) {
    return handleZodError(error);
  }
  if (isGenericError(error)) {
    return error.message;
  }
  return 'Something went wrong. Try again later.';
}

function handleZodError(error: ZodError): string {
  const errorMessages = error.errors.map((e) => `${e.path.join('.')} - ${e.message}`);
  logger.debug('Error messages:', errorMessages);
  return errorMessages.join(', ');
}
