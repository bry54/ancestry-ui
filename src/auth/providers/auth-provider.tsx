import { PropsWithChildren, useEffect, useState } from 'react';
import { JwtAuthAdapter } from '@/auth/adapters/jwt-auth-adapter.ts';
import { AuthContext } from '@/auth/context/auth-context';
import * as authHelper from '@/auth/lib/helpers';
import {
  AuthModel,
  IChangePassword,
  IResetPassword, ISelectRole,
  ISignIn,
  ISignUp,
  UserModel,
} from '@/lib/interfaces';

export function AuthProvider({ children }: PropsWithChildren) {
  const authModel = authHelper.getAuth();

  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | undefined>(
    authModel?.accessToken,
  );
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    setIsAdmin(currentUser?.isAdmin === true);
  }, [currentUser]);

  const verify = async () => {
    if (accessToken) {
      try {
        const user = await getUser();
        setCurrentUser(user || undefined);
      } catch {
        saveAuth(undefined);
        setCurrentUser(undefined);
      }
    }
  };

  const saveAuth = (auth: AuthModel | undefined) => {
    setAccessToken(auth?.accessToken);
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.removeAuth();
    }
  };

  const login = async (dto: ISignIn) => {
    try {
      const auth = await JwtAuthAdapter.login(dto);
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

  const requestPasswordReset = async (dto: IResetPassword) => {
    await JwtAuthAdapter.requestPasswordReset(dto);
  };

  const changePassword = async (dto: IChangePassword) => {
    await JwtAuthAdapter.changePassword(dto);
  };

  const resendVerificationEmail = async (email: string) => {
    await JwtAuthAdapter.resendVerificationEmail(email);
  };

  const getUser = async () => {
    return await JwtAuthAdapter.getCurrentUser();
  };

  const logout = async () => {
    await JwtAuthAdapter.logout();
    saveAuth(undefined);
    setCurrentUser(undefined);
  };

  const selectRole = async (dto: ISelectRole) => {
    try {
      const auth = await JwtAuthAdapter.selectRole(dto);
      saveAuth(auth);
      const user = await getUser();
      setCurrentUser(user || undefined);
    } catch (error) {
      saveAuth(undefined);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        accessToken,
        saveAuth,
        user: currentUser,
        setUser: setCurrentUser,
        login,
        register,
        requestPasswordReset,
        changePassword,
        resendVerificationEmail,
        getUser,
        logout,
        verify,
        selectRole,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
