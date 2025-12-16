export type ApiResponse<T = any, E = any> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  error?: E;
};
