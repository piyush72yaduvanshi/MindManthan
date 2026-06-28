import { AppError } from '../../shared/exceptions';

export class InvalidCredentialsError extends AppError {
  constructor() {
    super(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  }
}

export class EmailAlreadyExistsError extends AppError {
  constructor(email: string) {
    super(409, 'Email already registered', 'EMAIL_EXISTS', { email });
  }
}

export class EmailNotVerifiedError extends AppError {
  constructor() {
    super(403, 'Please verify your email address', 'EMAIL_NOT_VERIFIED');
  }
}

export class AccountInactiveError extends AppError {
  constructor() {
    super(403, 'Your account has been deactivated', 'ACCOUNT_INACTIVE');
  }
}

export class AccountDeletedError extends AppError {
  constructor() {
    super(410, 'This account has been deleted', 'ACCOUNT_DELETED');
  }
}

export class InvalidTokenError extends AppError {
  constructor() {
    super(400, 'Invalid or expired token', 'INVALID_TOKEN');
  }
}

export class TokenExpiredError extends AppError {
  constructor() {
    super(401, 'Token has expired', 'TOKEN_EXPIRED');
  }
}

export class WeakPasswordError extends AppError {
  constructor(errors: string[]) {
    super(400, 'Password does not meet security requirements', 'WEAK_PASSWORD', { errors });
  }
}

export class IncorrectPasswordError extends AppError {
  constructor() {
    super(400, 'Current password is incorrect', 'INCORRECT_PASSWORD');
  }
}

export class OAuthError extends AppError {
  constructor(provider: string, message?: string) {
    super(
      500,
      message || 'OAuth authentication failed',
      'OAUTH_ERROR',
      { provider }
    );
  }
}
