export class ApiError extends Error {
  constructor(statusCode, message, success) {
    super(message);
    this.statusCode = statusCode;
   
    this.message = message;
    this.success = success >= 400 ? false : true;
  }
}
