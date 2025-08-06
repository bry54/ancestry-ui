import { createContext, useContext } from 'react';
import {
  AuthModel,
  IChangePassword,
  IResetPassword,
  ISignIn,
  ISignUp,
  UserModel,
} from '@/lib/interfaces';

interface IContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  accessToken?: string;
  saveAuth: (auth: AuthModel | undefined) => void;
  user?: UserModel;
  setUser: React.Dispatch<React.SetStateAction<UserModel | undefined>>;
  login: (dto: ISignIn) => Promise<void>;
  register: (dto: ISignUp) => Promise<void>;
  requestPasswordReset: (dto: IResetPassword) => Promise<void>;
  changePassword: (dto: IChangePassword) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  getUser: () => Promise<UserModel | undefined>;
  logout: () => void;
  verify: () => Promise<void>;
  isAdmin: boolean;
}

// Create AuthContext with types
export const AuthContext = createContext<IContextType>({
  loading: false,
  setLoading: () => {},
  saveAuth: () => {},
  setUser: () => {},
  login: async () => {},
  register: async () => {},
  requestPasswordReset: async () => {},
  changePassword: async () => {},
  resendVerificationEmail: async () => {},
  getUser: async () => undefined,
  logout: () => {},
  verify: async () => {},
  isAdmin: false,
});

// Hook definition
export function useAuth() {
  return useContext(AuthContext);
}
