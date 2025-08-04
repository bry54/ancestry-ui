import { PropsWithChildren, useEffect, useState } from 'react';
import { JwtAuthAdapter } from '@/auth/adapters/jwt-auth-adapter.ts';
import { AuthContext } from '@/auth/context/auth-context';
import * as authHelper from '@/auth/lib/helpers';
import {
  AuthModel,
  IResetPassword,
  ISignIn,
  ISignUp,
  UserModel,
} from '@/auth/lib/models';

export function AuthProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    setIsAdmin(currentUser?.isAdmin === true);
  }, [currentUser]);

  const verify = async () => {
    if (auth) {
      try {
        const user: UserModel | null = await getUser();
        setCurrentUser(user || undefined);
      } catch {
        saveAuth(undefined);
        setCurrentUser(undefined);
      }
    }
  };

  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.removeAuth();
    }
  };

  const login = async (dto: ISignIn) => {
    try {
      const auth: AuthModel = await JwtAuthAdapter.login(dto);
      saveAuth(auth);
      const user = await getUser();
      setCurrentUser(user || undefined);
    } catch (error) {
      saveAuth(undefined);
      throw error;
    }
  };

  const register = async (dto: ISignUp) => {
    try {
      const auth = await JwtAuthAdapter.register(dto);
      saveAuth(auth);
      const user = await getUser();
      setCurrentUser(user || undefined);
    } catch (error) {
      saveAuth(undefined);
      throw error;
    }
  };

  const requestPasswordReset = async (email: string) => {
    await JwtAuthAdapter.requestPasswordReset(email);
  };

  const resetPassword = async (dto: IResetPassword) => {
    await JwtAuthAdapter.resetPassword(dto);
  };

  const resendVerificationEmail = async (email: string) => {
    await JwtAuthAdapter.resendVerificationEmail(email);
  };

  const getUser = async () => {
    return await JwtAuthAdapter.getCurrentUser();
  };

  const updateProfile = async (userData: Partial<UserModel>) => {
    return await JwtAuthAdapter.updateUserProfile(userData);
  };

  const logout = () => {
    JwtAuthAdapter.logout();
    saveAuth(undefined);
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        auth,
        saveAuth,
        user: currentUser,
        setUser: setCurrentUser,
        login,
        register,
        requestPasswordReset,
        resetPassword,
        resendVerificationEmail,
        getUser,
        updateProfile,
        logout,
        verify,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
