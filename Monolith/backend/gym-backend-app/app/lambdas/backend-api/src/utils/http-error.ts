class HttpError extends Error {
  public status: number;
  public message: string;
  public details?: any;

  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.message = message;
    this.details = details;
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  toApiResponse() {
    return {
      statusCode: this.status,
      body: JSON.stringify({
        error: {
          message: this.message,
          details: this.details,
        },
      }),
    };
  }
}

export default HttpError;
