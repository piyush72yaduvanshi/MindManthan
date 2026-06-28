import { FastifyRequest, FastifyReply } from 'fastify';
import { ForbiddenError, UnauthorizedError } from '../shared/exceptions';
import type { UserRole } from '../database/schema';

/**
 * Require user to have specific role(s)
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Check if user is authenticated
    if (!request.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const userRole = (request.user as any).role as UserRole;

    // Check if user has required role
    if (!allowedRoles.includes(userRole)) {
      throw new ForbiddenError(
        `Access denied. Required roles: ${allowedRoles.join(', ')}`
      );
    }
  };
};

/**
 * Require USER role
 */
export const requireUser = requireRole('USER', 'RECRUITER', 'ADMIN', 'SUPER_ADMIN');

/**
 * Require RECRUITER role
 */
export const requireRecruiter = requireRole('RECRUITER', 'ADMIN', 'SUPER_ADMIN');

/**
 * Require ADMIN role
 */
export const requireAdmin = requireRole('ADMIN', 'SUPER_ADMIN');

/**
 * Require SUPER_ADMIN role
 */
export const requireSuperAdmin = requireRole('SUPER_ADMIN');

/**
 * Require verified email
 */
export const requireVerifiedEmail = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (!request.user) {
    throw new UnauthorizedError('Authentication required');
  }

  // Note: You might want to fetch user from DB to check isVerified
  // For now, we'll assume it's in the JWT payload
  const isVerified = (request.user as any).isVerified;

  if (!isVerified) {
    throw new ForbiddenError('Email verification required');
  }
};

/**
 * Check if user is active
 */
export const requireActiveAccount = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (!request.user) {
    throw new UnauthorizedError('Authentication required');
  }

  const isActive = (request.user as any).isActive;

  if (!isActive) {
    throw new ForbiddenError('Account is not active');
  }
};
