import { User } from '../../database/schema';

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  role?: 'USER' | 'RECRUITER';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface VerifyEmailDto {
  token: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface OAuthCallbackDto {
  code: string;
  state?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: Omit<User, 'password' | 'refreshToken'>;
  tokens: AuthTokens;
}

export interface OAuthProfile {
  provider: 'GOOGLE' | 'GITHUB' | 'MICROSOFT' | 'APPLE' | 'LINKEDIN';
  providerId: string;
  email: string;
  name?: string;
  avatar?: string;
}
