import axios from 'axios';
import { OAuthProvider, Role } from '@/lib/enums';
import {
  Any,
  AuthModel,
  IChangePassword,
  IOAuthOptions,
  IResetPassword, ISelectRole,
  ISignIn,
  ISignUp,
  UserModel,
} from '@/lib/interfaces';

export const API_URL = import.meta.env.VITE_API_URL;
const LOGIN_URL = `${API_URL}/auth/login`;
const REGISTER_URL = `${API_URL}/auth/register`;
const RESET_PASSWORD_URL = `${API_URL}/auth/reset-password`;
const CHANGE_PASSWORD_URL = `${API_URL}/auth/change-password`;
const LOGOUT_URL = `${API_URL}/auth/logout`;
const ME_URL = `${API_URL}/auth/me`;
const SELECT_ROLE_URL = `${API_URL}/auth/select-role`;

export const JwtAuthAdapter = {
  /**
   * Login with email and password
   */
  async login(dto: ISignIn): Promise<AuthModel | undefined> {
    console.log('[JWTAuthAdapter]: Attempting login with email:', dto.email);

    try {
      const response = await axios.post(LOGIN_URL, dto);
      return response.data;
    } catch (e) {
      console.error('[JWTAuthAdapter]: Unexpected login error:', e);
      throw e;
    }
  },

  /**
   * Register a new user
   */
  async register(dto: ISignUp): Promise<AuthModel | undefined> {
    if (dto.password !== dto.passwordConfirmation) {
      throw new Error('Passwords do not match');
    }
    try {
      const response = await axios.post(REGISTER_URL, dto);
      return response.data;
    } catch (e: Any) {
      console.error('[JWTAuthAdapter]: Unexpected registration error:', e);
      throw e;
    }
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(dto: IResetPassword): Promise<void> {
    try {
      // Ensure the redirect URL is properly formatted with a hash for token
      const redirectUrl = `${window.location.origin}/auth/reset-password`;
      await axios.post(RESET_PASSWORD_URL, dto);
      console.info(
        '[JWTAuthAdapter]: Attempting reset password reset success',
        redirectUrl,
      );
    } catch (e) {
      console.error('[JWTAuthAdapter]: Unexpected error password reset:', e);
      throw e;
    }
  },

  /**
   * Reset password with token
   */
  async changePassword(dto: IChangePassword): Promise<void> {
    if (dto.password !== dto.passwordConfirmation) {
      throw new Error('Passwords do not match');
    }
    try {
      await axios.post(CHANGE_PASSWORD_URL, dto);
    } catch (e) {
      console.error(`[JWTAuthAdapter]: Enexpected error in changePassword`, e);
      throw e;
    }
  },

  /**
   * Request another verification email
   */
  async resendVerificationEmail(email: string): Promise<void> {
    //TODO: Implement logic for resend verification email
    console.info(`[JWTAuthAdapter]: Will resendVerificationEmail to: ${email}`);
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<UserModel | undefined> {
    try {
      const response: Any = await axios.get(ME_URL);
      return response.data;
    } catch (e) {
      console.error('[JWTAuthAdapter]: Unexpected error in getCurrentUser', e);
      throw e;
    }
  },

  async selectRole(dto: ISelectRole): Promise<AuthModel> {
    try {
      const response: Any = await axios.post(SELECT_ROLE_URL, dto);
      return response.data;
    } catch (e: Any) {
      console.error('[JWTAuthAdapter]: Error in selectRole:', e);
      throw e;
    }
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      await axios.post(LOGOUT_URL);
    } catch (e) {
      console.error('[JWTAuthAdapter]: Unexpected error in logout');
      throw e;
    }
  },

  /**
   * Login with OAuth provider (Google etc.)
   */
  async signInWithOAuth(
    provider: OAuthProvider,
    options?: IOAuthOptions,
  ): Promise<void> {
    try {
      const redirectTo =
        options?.redirectTo || `${window.location.origin}/auth/callback`;

      try {
        //TODO: Implement logic for signup with oauth provider
        console.log(
          `[JWTAuthAdapter]: ${provider} will redirectTo:`,
          redirectTo,
        );
      } catch (e: Any) {
        console.error('[JWTAuthAdapter]: OAuth error:', e);
      }
    } catch (error) {
      console.error('[JWTAuthAdapter]: Unexpected OAuth error:', error);
      throw error;
    }
  },
};
