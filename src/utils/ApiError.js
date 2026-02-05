export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}


// ------------- If we want to use function insead of class --------------

// const ApiError = (statusCode, message) => {
//   const err = new Error(message);
//   err.statusCode = statusCode;
//   return err;
// };

