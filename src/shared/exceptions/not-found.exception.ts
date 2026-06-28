import { AppError } from './base.exception';

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id 
      ? `${resource} with id ${id} not found` 
      : `${resource} not found`;
    super(404, message, 'NOT_FOUND', { resource, id });
  }
}
