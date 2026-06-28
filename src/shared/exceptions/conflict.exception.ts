import { AppError } from './base.exception';

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict', details?: any) {
    super(409, message, 'CONFLICT', details);
  }
}
