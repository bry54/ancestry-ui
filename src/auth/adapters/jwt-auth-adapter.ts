import { IResetPassword, ISignIn, ISignUp } from '@/auth/lib';
import { Any, AuthModel, UserModel } from '@/auth/lib/models';
import axios from 'axios';

const { VITE_API_URL } = import.meta.env;
const LOGIN_URL = `${VITE_API_URL}/auth/login`;
const REGISTER_URL = `${VITE_API_URL}/auth/login`;
const FORGOT_PASSWORD_URL = `${VITE_API_URL}/auth/forgot-password`;
const RESET_PASSWORD_URL = `${VITE_API_URL}/auth/reset-password`;
const AUTH_ME_URL = `${VITE_API_URL}/auth/me`;
const RESEND_VERIFICATION_EMAIL_URL = `${VITE_API_URL}/auth/resend-verification-email`;
const LOGOUT_URL = `${VITE_API_URL}/auth/logout`;

export const JwtAuthAdapter = {
  /**
   * Login with email and password
   */
  async login(dto: ISignIn): Promise<AuthModel> {
    console.log('JWT Auth Adapter: Attempting login with email:', dto.email);

    try {
      const { data } = await axios.post(LOGIN_URL, dto);

      return {
        token: data.token,
        refreshToken: data.refreshToken,
      };
    } catch (error: Any) {
      console.error('LOGIN_ERROR:', error);
      throw new Error(error?.response?.data?.message || error.message);
    }
  },

  /**
   * Register a new user
   */
  async register(dto: ISignUp): Promise<AuthModel> {
    if (dto.password !== dto.passwordConfirmation) {
      throw new Error('Passwords do not match');
    }

    try {
      const { data } = await axios.post(REGISTER_URL, dto);

      return {
        token: data.session.accessToken,
        refreshToken: data.session.refreshToken,
      };
    } catch (error: Any) {
      throw new Error(error.message);
    }
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    console.log('Requesting password reset for:', email);

    try {
      const redirectUrl = `${window.location.origin}/auth/reset-password`;
      console.log('Using redirect URL:', redirectUrl);
      await axios.post(FORGOT_PASSWORD_URL, { email });
    } catch (error: Any) {
      console.error('Password reset request error:', error);
      throw new Error(error.message);
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(dto: IResetPassword): Promise<void> {
    try {
      if (dto.password !== dto.passwordConfirmation) {
        throw new Error('Passwords do not match');
      }
      await axios.post(RESET_PASSWORD_URL, dto);
    } catch (error: Any) {
      throw new Error(error.message);
    }
  },

  /**
   * Request another verification email
   */
  async resendVerificationEmail(email: string): Promise<void> {
    try {
      await axios.post(RESEND_VERIFICATION_EMAIL_URL, {
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify-email`,
        },
      });
    } catch (e: Any) {
      throw new Error(e.message);
    }
  },

  /**
   * Get current user from the session
   */
  async getCurrentUser(): Promise<UserModel | null> {
    try {
      const { data } = await axios.get(AUTH_ME_URL);
      return data;
    } catch (e: Any) {
      throw new Error(e.message);
    }
  },

  /**
   * Update user profile (stored in metadata)
   */
  async updateUserProfile(userData: Partial<UserModel>): Promise<UserModel> {
    console.log('Update user profile:', userData);
    return this.getCurrentUser() as Promise<UserModel>;
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      await axios.post(LOGOUT_URL);
    } catch (error: Any) {
      throw new Error(error.message);
    }
  },

  /**
   * Login with OAuth provider (Google, GitHub, etc.)
   */
  async signInWithOAuth(
    provider:
      | 'google'
      | 'github'
      | 'facebook'
      | 'twitter'
      | 'discord'
      | 'slack',
    options?: { redirectTo?: string },
  ): Promise<void> {
    console.log(
      'SupabaseAdapter: Initiating OAuth flow with provider:',
      provider,
      options,
    );

    throw new Error('Method not implemented.');
  },
};
