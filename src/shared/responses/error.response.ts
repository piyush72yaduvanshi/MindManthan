export interface ErrorResponse {
  success: false;
  statusCode: number;
  code: string;
  message: string;
  errors?: any;
  timestamp: string;
}
