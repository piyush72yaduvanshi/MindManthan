import { AuthRepository } from './auth.repository';
import { TokenRepository } from './auth.token.repository';
import { JwtService } from '../../services/jwt.service';
import { HashService } from '../../services/hash.service';
import { EmailService } from '../../services/email.service';
import { AuthMapper } from './auth.mapper';
import { generateToken, calculateExpiry, hashToken } from './auth.utils';
import { AUTH_CONSTANTS } from './auth.constants';
import { tokenTypes } from '../../database/schema';
import {
  InvalidCredentialsError,
  EmailAlreadyExistsError,
  EmailNotVerifiedError,
  AccountInactiveError,
  AccountDeletedError,
  InvalidTokenError,
  IncorrectPasswordError,
  WeakPasswordError,
} from './auth.errors';
import type {
  RegisterDto,
  LoginDto,
  AuthResponse,
  OAuthProfile,
  ChangePasswordDto,
} from './auth.types';
import { db } from '../../database/client';
import { profiles } from '../../database/schema';

export class AuthService {
  private repository: AuthRepository;
  private tokenRepository: TokenRepository;

  constructor() {
    this.repository = new AuthRepository();
    this.tokenRepository = new TokenRepository();
  }

  /**
   * Register a new user
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    // Check if email already exists
    const existingUser = await this.repository.findByEmail(data.email);
    if (existingUser) {
      throw new EmailAlreadyExistsError(data.email);
    }

    // Validate password strength
    const { isValid, errors } = HashService.validatePasswordStrength(data.password);
    if (!isValid) {
      throw new WeakPasswordError(errors);
    }

    // Hash password
    const hashedPassword = await HashService.hashPassword(data.password);

    // Create user
    const user = await this.repository.create({
      email: data.email,
      password: hashedPassword,
      provider: 'EMAIL',
      role: data.role || 'USER',
      isVerified: false,
      isActive: true,
    });

    // Create profile
    await db.insert(profiles).values({
      userId: user.id,
      fullName: data.fullName,
    });

    // Generate verification token
    const verificationToken = generateToken();
    const hashedToken = hashToken(verificationToken);
    const expiresAt = calculateExpiry(AUTH_CONSTANTS.TOKEN_EXPIRY.EMAIL_VERIFICATION);

    // Store verification token
    await this.tokenRepository.create({
      userId: user.id,
      token: hashedToken,
      type: tokenTypes.EMAIL_VERIFICATION,
      expiresAt,
    });
    
    // Send verification email
    await EmailService.sendVerificationEmail(user.email, verificationToken);

    // Generate tokens
    const { accessToken, refreshToken } = JwtService.generateTokenPair(user);

    // Store refresh token
    await this.repository.updateRefreshToken(user.id, refreshToken);

    return AuthMapper.toAuthResponse(user, accessToken, refreshToken);
  }

  /**
   * Login with email and password
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    // Find user
    const user = await this.repository.findByEmail(data.email);
    if (!user || !user.password) {
      throw new InvalidCredentialsError();
    }

    // Check if account is deleted
    if (user.deletedAt) {
      throw new AccountDeletedError();
    }

    // Check if account is active
    if (!user.isActive) {
      throw new AccountInactiveError();
    }

    // Verify password
    const isValidPassword = await HashService.comparePassword(
      data.password,
      user.password
    );
    if (!isValidPassword) {
      throw new InvalidCredentialsError();
    }

    // Check if email is verified
    if (!user.isVerified) {
      throw new EmailNotVerifiedError();
    }

    // Generate tokens
    const { accessToken, refreshToken } = JwtService.generateTokenPair(user);

    // Update refresh token and last login
    await this.repository.updateRefreshToken(user.id, refreshToken);
    await this.repository.updateLastLogin(user.id);

    return AuthMapper.toAuthResponse(user, accessToken, refreshToken);
  }

  /**
   * Refresh access token
   */
  async refreshToken(token: string): Promise<AuthResponse> {
    // Verify refresh token
    const payload = JwtService.verify(token);

    // Find user
    const user = await this.repository.findById(payload.sub);
    if (!user) {
      throw new InvalidTokenError();
    }

    // Check if stored refresh token matches
    if (user.refreshToken !== token) {
      throw new InvalidTokenError();
    }

    // Generate new token pair
    const { accessToken, refreshToken: newRefreshToken } = 
      JwtService.generateTokenPair(user);

    // Update refresh token (token rotation)
    await this.repository.updateRefreshToken(user.id, newRefreshToken);

    return AuthMapper.toAuthResponse(user, accessToken, newRefreshToken);
  }

  /**
   * Logout user
   */
  async logout(userId: string): Promise<void> {
    await this.repository.updateRefreshToken(userId, null);
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<void> {
    const hashedToken = hashToken(token);

    // Find valid token
    const tokenRecord = await this.tokenRepository.findValidToken(
      hashedToken,
      tokenTypes.EMAIL_VERIFICATION
    );

    if (!tokenRecord) {
      throw new InvalidTokenError();
    }

    // Mark user as verified
    await this.repository.verifyEmail(tokenRecord.userId);

    // Mark token as used
    await this.tokenRepository.markAsUsed(tokenRecord.id);
  }

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<void> {
    const user = await this.repository.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists
      return;
    }

    if (user.isVerified) {
      return;
    }

    // Delete any existing verification tokens for this user
    await this.tokenRepository.deleteByUserAndType(
      user.id,
      tokenTypes.EMAIL_VERIFICATION
    );

    // Generate new token
    const verificationToken = generateToken();
    const hashedToken = hashToken(verificationToken);
    const expiresAt = calculateExpiry(AUTH_CONSTANTS.TOKEN_EXPIRY.EMAIL_VERIFICATION);

    // Store new token
    await this.tokenRepository.create({
      userId: user.id,
      token: hashedToken,
      type: tokenTypes.EMAIL_VERIFICATION,
      expiresAt,
    });

    // Send verification email
    await EmailService.sendVerificationEmail(user.email, verificationToken);
  }

  /**
   * Send password reset email
   */
  async forgotPassword(email: string): Promise<void> {
    const user = await this.repository.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists
      return;
    }

    // Delete any existing reset tokens for this user
    await this.tokenRepository.deleteByUserAndType(
      user.id,
      tokenTypes.PASSWORD_RESET
    );

    // Generate reset token
    const resetToken = generateToken();
    const hashedToken = hashToken(resetToken);
    const expiresAt = calculateExpiry(AUTH_CONSTANTS.TOKEN_EXPIRY.PASSWORD_RESET);

    // Store reset token
    await this.tokenRepository.create({
      userId: user.id,
      token: hashedToken,
      type: tokenTypes.PASSWORD_RESET,
      expiresAt,
    });

    // Send password reset email
    await EmailService.sendPasswordResetEmail(user.email, resetToken);
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashedToken = hashToken(token);

    // Find valid token
    const tokenRecord = await this.tokenRepository.findValidToken(
      hashedToken,
      tokenTypes.PASSWORD_RESET
    );

    if (!tokenRecord) {
      throw new InvalidTokenError();
    }

    // Validate password strength
    const { isValid, errors } = HashService.validatePasswordStrength(newPassword);
    if (!isValid) {
      throw new WeakPasswordError(errors);
    }

    // Hash new password
    const hashedPassword = await HashService.hashPassword(newPassword);

    // Update password
    await this.repository.updatePassword(tokenRecord.userId, hashedPassword);

    // Mark token as used
    await this.tokenRepository.markAsUsed(tokenRecord.id);

    // Invalidate all refresh tokens (force re-login on all devices)
    await this.repository.updateRefreshToken(tokenRecord.userId, null);
  }

  /**
   * Change password (authenticated user)
   */
  async changePassword(
    userId: string,
    data: ChangePasswordDto
  ): Promise<void> {
    const user = await this.repository.findById(userId);
    if (!user || !user.password) {
      throw new InvalidCredentialsError();
    }

    // Verify current password
    const isValidPassword = await HashService.comparePassword(
      data.currentPassword,
      user.password
    );
    if (!isValidPassword) {
      throw new IncorrectPasswordError();
    }

    // Validate new password
    const { isValid, errors } = HashService.validatePasswordStrength(data.newPassword);
    if (!isValid) {
      throw new WeakPasswordError(errors);
    }

    // Hash and update password
    const hashedPassword = await HashService.hashPassword(data.newPassword);
    await this.repository.updatePassword(userId, hashedPassword);

    // Invalidate refresh token (force re-login)
    await this.repository.updateRefreshToken(userId, null);
  }

  /**
   * OAuth login/register
   */
  async oauthLogin(profile: OAuthProfile): Promise<AuthResponse> {
    // Try to find existing user by provider
    let user = await this.repository.findByProvider(
      profile.provider,
      profile.providerId
    );

    // If user doesn't exist, create one
    if (!user) {
      // Check if email already exists with different provider
      const existingEmailUser = await this.repository.findByEmail(profile.email);
      if (existingEmailUser) {
        // Link accounts or throw error based on business logic
        throw new EmailAlreadyExistsError(profile.email);
      }

      // Create new user
      user = await this.repository.create({
        email: profile.email,
        provider: profile.provider,
        providerId: profile.providerId,
        role: 'USER',
        isVerified: true, // OAuth emails are pre-verified
        isActive: true,
      });

      // Create profile
      await db.insert(profiles).values({
        userId: user.id,
        fullName: profile.name || profile.email.split('@')[0],
        avatarUrl: profile.avatar,
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = JwtService.generateTokenPair(user);

    // Update refresh token and last login
    await this.repository.updateRefreshToken(user.id, refreshToken);
    await this.repository.updateLastLogin(user.id);

    return AuthMapper.toAuthResponse(user, accessToken, refreshToken);
  }

  /**
   * Get current user
   */
  async getCurrentUser(userId: string) {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new InvalidCredentialsError();
    }
    return AuthMapper.toUserDto(user);
  }

  /**
   * Deactivate account
   */
  async deactivateAccount(userId: string): Promise<void> {
    await this.repository.deactivate(userId);
  }
}
