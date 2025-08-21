import { Agent, LanguageCode, Role } from '@/lib/enums';

export type Any = any;

// Interface for login response
export interface AuthModel {
  accessToken: string;
  refreshToken?: string;
}

// User model representing the user profile
export interface UserModel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  emailVerified?: boolean;
  roles?: Role[];
  role?: Role;
  photoURL?: string;
  language?: LanguageCode;
  isAdmin?: boolean;
  agent: string;
}

export interface ISignIn {
  email: string;
  password: string;
  agent: Agent;
}

export interface IResetPassword {
  email: string;
}

export interface IChangePassword {
  password: string;
  passwordConfirmation: string;
}

export interface ISelectRole {
  role: Role;
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

export interface IOAuthOptions {
  redirectTo?: string;
}
