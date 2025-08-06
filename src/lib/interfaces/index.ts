import { LanguageCode } from '@/lib/enums';

export type Any = any;

// Interface for login response
export interface AuthModel {
  access_token: string;
  refresh_token?: string;
}

// User model representing the user profile
export interface UserModel {
  username: string;
  password?: string;
  email: string;
  first_name: string;
  last_name: string;
  fullname?: string;
  email_verified?: boolean;
  occupation?: string;
  company_name?: string;
  phone?: string;
  roles?: number[];
  pic?: string;
  language?: LanguageCode;
  is_admin?: boolean;
}

export interface ISignIn {
  email: string;
  password: string;
  agent: string;
}

export interface IResetPassword {
  password: string;
  passwordConfirmation: string;
}

export interface ISignUp {
  email: string;
  password: string;
  passwordConfirmation: string;
  phone?: string;
  person: {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    dateOfDeath?: string;
    gender?: string;
    otherGivenNames?: string[];
    nickNames?: string[];
    nationalId?: string;
    passportNumber?: string;
    birthCertificateEntry?: string;
    motherName?: string;
    fatherName?: string;
    placeOfBirth?: {
      city: string;
      country: string;
    };
    placeOfDeath?: {
      city: string;
      country: string;
    };
  };
}
