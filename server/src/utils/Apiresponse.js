export class Apiresponse extends Response {
  constructor(statusCode, data, message = "", success) {
    super(message);
    this.statusCode = statusCode;
    (this.data = data), (this.message = message);
    this.success = success >= 400 ? false : true;
  }
}
