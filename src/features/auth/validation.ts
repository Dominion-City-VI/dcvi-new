import { upperCaseRegex, lowerCaseRegex, numberRegex, specialCharcterRegex } from '@/utils';
import { z } from 'zod';

export const email = z
  .string({ required_error: 'Email is required.' })
  .email('Invalid email address.');
export const password = z
  .string({ required_error: 'Password is required.' })
  .min(8, {
    message: 'Must contain at least an uppercase, lowercase, special character and a number.'
  })
  .refine((value) => upperCaseRegex.test(value), 'Password must contain atleast an uppercase.')
  .refine((value) => numberRegex.test(value), 'Password must contain atleast a number.')
  .refine(
    (value) => specialCharcterRegex.test(value),
    'Password must contain at least a special character.'
  )
  .refine((value) => lowerCaseRegex.test(value), 'Password must contain atleast a lowercase.');
export const confirmPassword = z
  .string()
  .trim()
  .min(1, { message: 'Confirm password is required.' });

export const firstName = z
  .string()
  .trim()
  .min(2, { message: 'First Name is required.' })
  .refine((value) => numberRegex.test(value) === false, 'Numbers not allowed.');

export const lastName = z
  .string()
  .trim()
  .min(2, { message: 'Last Name is required.' })
  .refine((value) => numberRegex.test(value) === false, 'Numbers not allowed.');

export const phoneNumber = z
  .string({ required_error: 'Phone number is required.' })
  .trim()
  .superRefine((val, ctx) => {
    if (upperCaseRegex.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Phone Number can not contain uppercase letters.'
      });
    }

    if (lowerCaseRegex.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Phone Number can not contain lowercase letters.'
      });
    }
    if (specialCharcterRegex.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Phone Number can not contain special letters.'
      });
    }

    if (val.length > 15) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Phone number can not be more than 15 digits.'
      });
    }
  });

export const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional()
});

export const AuthLoginResponseSchema = z.object({
  access_token: z.string(),
  email_verified: z.boolean()
});

export const LoginValidationSchema = z.object({
  emailAddress: email,
  password
});

export const CreateAccountValidationSchema = z
  .object({
    firstName,
    lastName,
    email,
    role: z.string({ required_error: 'Select a role' }).trim().min(1, { message: 'Select role.' }),
    password,
    confirmPassword
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword']
  });

export const CreatePatientAcctValidationSchema = z
  .object({
    email,
    password,
    confirmPassword
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword']
  });

export const PwdResetSchema = z
  .object({
    emailAddress: email,
    newPassword: password,
    rePassword: password,
    otp: z
      .string({ required_error: 'Otp is required.' })
      .refine((value) => value !== '', 'Otp is required.')
  })
  .refine((data) => data.newPassword === data.rePassword, {
    message: 'Passwords do not match.',
    path: ['rePassword']
  });

export const NewPwdSchema = z
  .object({
    newPassword: password,
    confirmPassword
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword']
  });

export const ForgotPwdSchema = z.object({
  emailAddress: email
});

export const PersonalInfoSchema = z
  .object({
    firstName,
    lastName,
    phoneNumber,
    password,
    confirmPassword,
    emailAddress: email,
    maritalStatus: z.string({ required_error: 'Marital status is required.' }).trim(),
    gender: z.string({ required_error: 'Gender is required.' }).trim(),
    address: z.string({ required_error: 'Address is required.' }).trim()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword']
  });

export const OthersSchema = z.object({
  occupation: z
    .string({ required_error: 'Occupation is required' })
    .trim()
    .refine((value) => value !== '', 'Occupation is required'),
  trainings: z.array(optionSchema, { required_error: 'Training is required' }).default([]),
  departments: z.array(optionSchema, { required_error: 'Department is required' }).min(1),
  zoneId: z
    .string()
    // .string({ required_error: 'Zone is required.' })
    .trim()
    // .refine((value) => value.length !== 0, 'Zone is required.'),
    .default(''),
  cellId: z.string({ required_error: 'cell is required.' }).default(''),
  isConsideredLeader: z.boolean().default(false),
  isAssistantCellLeader: z.boolean().default(false)
});

export const UserRequestFormSchema = PersonalInfoSchema.and(OthersSchema);

export type TAuthLoginResponse = IDCVIServerRes<z.infer<typeof AuthLoginResponseSchema>>;
export type TLogin = z.infer<typeof LoginValidationSchema>;
export type TCreateAccount = z.infer<typeof CreateAccountValidationSchema>;
export type TCreatePatientAcct = z.infer<typeof CreatePatientAcctValidationSchema>;
export type TPwdResetSchema = z.infer<typeof PwdResetSchema>;
export type TNewPwdSchema = z.infer<typeof NewPwdSchema>;
export type TForgotPwd = z.infer<typeof ForgotPwdSchema>;
export type TPersonalInfoSchema = z.infer<typeof PersonalInfoSchema>;
export type TOthersSchema = z.infer<typeof OthersSchema>;
export type TUserRequestSchema = z.infer<typeof UserRequestFormSchema>;
