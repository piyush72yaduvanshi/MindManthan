import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { ResponseBuilder } from '../../shared/responses';
import { ValidationError } from '../../shared/exceptions';
import { AUTH_MESSAGES } from './auth.constants';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from './auth.schema';
import type {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
  VerifyEmailInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from './auth.schema';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register a new user
   * POST /auth/register
   */
  async register(
    request: FastifyRequest<{ Body: RegisterInput }>,
    reply: FastifyReply
  ) {
    // Validate request body
    const validatedData = registerSchema.parse(request.body);

    // Register user
    const result = await this.authService.register(validatedData);

    return reply.code(201).send(
      ResponseBuilder.success(result, AUTH_MESSAGES.REGISTER_SUCCESS)
    );
  }

  /**
   * Login with email and password
   * POST /auth/login
   */
  async login(
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply
  ) {
    // Validate request body
    const validatedData = loginSchema.parse(request.body);

    // Login user
    const result = await this.authService.login(validatedData);

    // Set refresh token in HTTP-only cookie
    reply.setCookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return reply.send(
      ResponseBuilder.success(result, AUTH_MESSAGES.LOGIN_SUCCESS)
    );
  }

  /**
   * Refresh access token
   * POST /auth/refresh
   */
  async refreshToken(
    request: FastifyRequest<{ Body: RefreshTokenInput }>,
    reply: FastifyReply
  ) {
    // Get refresh token from body or cookie
    const refreshToken =
      request.body?.refreshToken || request.cookies.refreshToken;

    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    // Validate
    const validatedData = refreshTokenSchema.parse({ refreshToken });

    // Refresh token
    const result = await this.authService.refreshToken(validatedData.refreshToken);

    // Update cookie
    reply.setCookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return reply.send(ResponseBuilder.success(result));
  }

  /**
   * Logout user
   * POST /auth/logout
   */
  async logout(request: FastifyRequest, reply: FastifyReply) {
    // Get user ID from JWT (set by auth middleware)
    const userId = (request.user as any)?.sub;

    if (userId) {
      await this.authService.logout(userId);
    }

    // Clear cookie
    reply.clearCookie('refreshToken', { path: '/' });

    return reply.send(
      ResponseBuilder.success(null, AUTH_MESSAGES.LOGOUT_SUCCESS)
    );
  }

  /**
   * Get current authenticated user
   * GET /auth/me
   */
  async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any)?.sub;

    const user = await this.authService.getCurrentUser(userId);

    return reply.send(ResponseBuilder.success(user));
  }

  /**
   * Verify email with token
   * POST /auth/verify-email
   */
  async verifyEmail(
    request: FastifyRequest<{ Body: VerifyEmailInput }>,
    reply: FastifyReply
  ) {
    const validatedData = verifyEmailSchema.parse(request.body);

    await this.authService.verifyEmail(validatedData.token);

    return reply.send(
      ResponseBuilder.success(null, AUTH_MESSAGES.EMAIL_VERIFIED)
    );
  }

  /**
   * Resend verification email
   * POST /auth/resend-verification
   */
  async resendVerification(
    request: FastifyRequest<{ Body: { email: string } }>,
    reply: FastifyReply
  ) {
    await this.authService.resendVerification(request.body.email);

    return reply.send(
      ResponseBuilder.success(null, AUTH_MESSAGES.VERIFICATION_SENT)
    );
  }

  /**
   * Send password reset email
   * POST /auth/forgot-password
   */
  async forgotPassword(
    request: FastifyRequest<{ Body: ForgotPasswordInput }>,
    reply: FastifyReply
  ) {
    const validatedData = forgotPasswordSchema.parse(request.body);

    await this.authService.forgotPassword(validatedData.email);

    return reply.send(
      ResponseBuilder.success(null, AUTH_MESSAGES.PASSWORD_RESET_SENT)
    );
  }

  /**
   * Reset password with token
   * POST /auth/reset-password
   */
  async resetPassword(
    request: FastifyRequest<{ Body: ResetPasswordInput }>,
    reply: FastifyReply
  ) {
    const validatedData = resetPasswordSchema.parse(request.body);

    await this.authService.resetPassword(
      validatedData.token,
      validatedData.password
    );

    return reply.send(
      ResponseBuilder.success(null, AUTH_MESSAGES.PASSWORD_RESET_SUCCESS)
    );
  }

  /**
   * Change password (authenticated)
   * POST /auth/change-password
   */
  async changePassword(
    request: FastifyRequest<{ Body: ChangePasswordInput }>,
    reply: FastifyReply
  ) {
    const userId = (request.user as any)?.sub;
    const validatedData = changePasswordSchema.parse(request.body);

    await this.authService.changePassword(userId, validatedData);

    return reply.send(
      ResponseBuilder.success(null, AUTH_MESSAGES.PASSWORD_CHANGED)
    );
  }

  /**
   * Deactivate account
   * DELETE /auth/account
   */
  async deactivateAccount(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any)?.sub;

    await this.authService.deactivateAccount(userId);

    // Clear cookie
    reply.clearCookie('refreshToken', { path: '/' });

    return reply.send(
      ResponseBuilder.success(null, AUTH_MESSAGES.ACCOUNT_DEACTIVATED)
    );
  }
}
