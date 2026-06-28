import { AppError } from './base.exception';
import { ZodError } from 'zod';

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', errors?: any) {
    super(400, message, 'VALIDATION_ERROR', errors);
  }

  static fromZod(error: ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return new ValidationError('Validation failed', formattedErrors);
  }
}
