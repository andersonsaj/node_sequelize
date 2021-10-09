class AppError {
  readonly message: string | unknown;

  readonly statusCode: number;

  constructor(message: string | unknown, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default AppError;
