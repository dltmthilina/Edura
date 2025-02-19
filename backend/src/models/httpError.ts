class HttpError extends Error {
  code: number;

  constructor(message: string, errorCode: number) {
    super(message); // Call the parent class constructor (Error)
    this.code = errorCode; // Assign the custom error code
    Object.setPrototypeOf(this, HttpError.prototype); // Maintain prototype chain
  }
}

export default HttpError;
