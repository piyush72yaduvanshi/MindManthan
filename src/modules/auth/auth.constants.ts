export const AUTH_CONSTANTS = {
  // Token expiry
  TOKEN_EXPIRY: {
    EMAIL_VERIFICATION: 24 * 60 * 60 * 1000, // 24 hours
    PASSWORD_RESET: 60 * 60 * 1000, // 1 hour
  },
  
  // Password rules
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  
  // Rate limiting
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  
  // Cookie options
  REFRESH_TOKEN_COOKIE: 'refreshToken',
  COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'Email already registered',
  EMAIL_NOT_VERIFIED: 'Please verify your email address',
  ACCOUNT_INACTIVE: 'Your account has been deactivated',
  ACCOUNT_DELETED: 'This account has been deleted',
  INVALID_TOKEN: 'Invalid or expired token',
  TOKEN_EXPIRED: 'Token has expired',
  WEAK_PASSWORD: 'Password does not meet security requirements',
  INCORRECT_PASSWORD: 'Current password is incorrect',
  OAUTH_ERROR: 'OAuth authentication failed',
} as const;

export const AUTH_MESSAGES = {
  REGISTER_SUCCESS: 'Registration successful. Please check your email for verification.',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  EMAIL_VERIFIED: 'Email verified successfully',
  VERIFICATION_SENT: 'Verification email sent',
  PASSWORD_RESET_SENT: 'Password reset link sent to your email',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
  PASSWORD_CHANGED: 'Password changed successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  ACCOUNT_DEACTIVATED: 'Account deactivated successfully',
} as const;
