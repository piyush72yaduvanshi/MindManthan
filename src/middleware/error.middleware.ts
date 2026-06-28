import { FastifyRequest, FastifyReply, FastifyError } from 'fastify';
import { ZodError } from 'zod';
import { AppError, ValidationError } from '../shared/exceptions';
import { ResponseBuilder } from '../shared/responses';

/**
 * Global error handler for Fastify
 */
export const errorHandler = (
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  // Log error
  request.log.error({
    err: error,
    requestId: request.id,
    url: request.url,
    method: request.method,
  });

  // Handle AppError (our custom errors)
  if (error instanceof AppError) {
    return reply.code(error.statusCode).send(error.toJSON());
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const validationError = ValidationError.fromZod(error);
    return reply.code(400).send(validationError.toJSON());
  }

  // Handle Fastify validation errors
  if ('validation' in error) {
    return reply.code(400).send(
      ResponseBuilder.error(
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        (error as any).validation
      )
    );
  }

  // Handle Fastify errors with statusCode
  if ('statusCode' in error && typeof error.statusCode === 'number') {
    return reply.code(error.statusCode).send(
      ResponseBuilder.error(
        error.message || 'An error occurred',
        'FASTIFY_ERROR',
        error.statusCode
      )
    );
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return reply.code(401).send(
      ResponseBuilder.error('Invalid token', 'INVALID_TOKEN', 401)
    );
  }

  if (error.name === 'TokenExpiredError') {
    return reply.code(401).send(
      ResponseBuilder.error('Token expired', 'TOKEN_EXPIRED', 401)
    );
  }

  // Handle database errors
  if (error.name === 'PostgresError') {
    // Don't expose database errors in production
    const message =
      process.env.NODE_ENV === 'production'
        ? 'Database error occurred'
        : error.message;

    return reply.code(500).send(
      ResponseBuilder.error(message, 'DATABASE_ERROR', 500)
    );
  }

  // Default to 500 Internal Server Error
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message || 'An unexpected error occurred';

  return reply.code(500).send(
    ResponseBuilder.error(message, 'INTERNAL_ERROR', 500)
  );
};
