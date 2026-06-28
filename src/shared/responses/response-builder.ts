export class ResponseBuilder {
  static success<T>(data: T, message: string = 'Success') {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(message: string, code: string, statusCode: number, errors?: any) {
    return {
      success: false,
      statusCode,
      code,
      message,
      ...(errors && { errors }),
      timestamp: new Date().toISOString(),
    };
  }

  static paginated<T>(
    data: T[],
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    }
  ) {
    return {
      success: true,
      data,
      meta,
      timestamp: new Date().toISOString(),
    };
  }
}
