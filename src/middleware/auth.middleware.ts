import { FastifyRequest, FastifyReply } from 'fastify';
import { JwtService } from '../services/jwt.service';
import { UnauthorizedError } from '../shared/exceptions';

/**
 * Authenticate user by verifying JWT token
 */
export const authenticateUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const payload = JwtService.verify(token);

    // Attach user to request
    request.user = payload;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Invalid or expired token');
  }
};

/**
 * Optional authentication - doesn't throw if no token
 */
export const optionalAuth = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const authHeader = request.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = JwtService.verify(token);
      request.user = payload;
    }
  } catch (error) {
    // Silently fail for optional auth
    request.user = undefined;
  }
};
