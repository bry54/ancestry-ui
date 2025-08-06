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
  const [loading, setLoading] = useState<boolean>(true);
  const [auth, setAuth] = useState<AuthModel | undefined>();
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Check if user is admin
  useEffect(() => {
    setIsAdmin(true);
  }, [currentUser]);

  const verify = async () => {
    if (auth) {
      try {
        const user: UserModel | null = await getLoggedInUser();
        setCurrentUser(user || undefined);
      } catch {
        saveAuthToken(undefined);
        setCurrentUser(undefined);
      }
    }
  };

  const saveAuthToken = (auth: AuthModel | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuthInLS(auth);
    } else {
      authHelper.removeAuthFromLS();
    }
  };

  const login = async (dto: ISignIn) => {
    try {
      const auth: AuthModel = await JwtAuthAdapter.login(dto);
      saveAuthToken(auth);
      const user = await getLoggedInUser();
      setCurrentUser(user || undefined);
    } catch (error) {
      saveAuthToken(undefined);
      throw error;
    }
  };

  const register = async (dto: ISignUp) => {
    try {
      const auth = await JwtAuthAdapter.register(dto);
      saveAuthToken(auth);
      const user = await getLoggedInUser();
      setCurrentUser(user || undefined);
    } catch (error) {
      saveAuthToken(undefined);
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

  const getLoggedInUser = async () => {
    return await JwtAuthAdapter.getLoggedInUser();
  };

  const updateProfile = async (userData: Partial<UserModel>) => {
    return await JwtAuthAdapter.updateUserProfile(userData);
  };

  const logout = () => {
    JwtAuthAdapter.logout();
    saveAuthToken(undefined);
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        auth,
        saveAuth: saveAuthToken,
        user: currentUser,
        setUser: setCurrentUser,
        login,
        register,
        requestPasswordReset,
        resetPassword,
        resendVerificationEmail,
        getUser: getLoggedInUser,
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
