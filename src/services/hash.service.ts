import { PasswordHelper } from '../shared/helpers/password.helper';

export class HashService {
  /**
   * Hash a password
   */
  static async hashPassword(password: string): Promise<string> {
    return PasswordHelper.hash(password);
  }

  /**
   * Compare password with hash
   */
  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return PasswordHelper.compare(password, hashedPassword);
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    return PasswordHelper.validateStrength(password);
  }
}
