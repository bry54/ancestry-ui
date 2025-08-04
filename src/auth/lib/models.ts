// Define UUID type for consistent usage
export type UUID = string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;

// Language code type for user preferences
export type LanguageCode = 'en' | 'de' | 'es' | 'fr' | 'ja' | 'zh';

export interface ISignIn {
  email: string;
  password: string;
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

export interface AuthModel {
  token: string;
  refreshToken?: string;
}

// User model representing the user profile
export interface UserModel {
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string; // May be stored directly in metadata
  emailVerified?: boolean;
  roles?: number[]; // Array of role IDs
  photoURL?: string;
  language?: LanguageCode; // Maintain existing type
  isAdmin?: boolean; // Added admin flag
  role: string;
}
