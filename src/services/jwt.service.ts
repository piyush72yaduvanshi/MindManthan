import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';
import { User } from '../database/schema';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: string;
  provider: string;
  iat?: number;
  exp?: number;
}

export class JwtService {
  /**
   * Generate access token
   */
  static generateAccessToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      provider: user.provider,
    };

    return jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.accessTokenExpiry,
      algorithm: jwtConfig.algorithm,
    });
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      provider: user.provider,
    };

    return jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.refreshTokenExpiry,
      algorithm: jwtConfig.algorithm,
    });
  }

  /**
   * Verify token and return payload
   */
  static verify(token: string): JwtPayload {
    return jwt.verify(token, jwtConfig.secret, {
      algorithms: [jwtConfig.algorithm],
    }) as JwtPayload;
  }

  /**
   * Decode token without verification (for debugging)
   */
  static decode(token: string): JwtPayload | null {
    return jwt.decode(token) as JwtPayload | null;
  }

  /**
   * Generate both access and refresh tokens
   */
  static generateTokenPair(user: User): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }
}
