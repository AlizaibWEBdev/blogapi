class ApiError extends Error {
    constructor(
        statusCode,
        message = "somthing went wrong",
        errors = [], stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors
        this.data = null;
        this.succses = false;
        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }

}

module.exports = ApiError;

