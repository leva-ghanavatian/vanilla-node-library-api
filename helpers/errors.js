class AppError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

class ValidationError extends AppError {
    constructor(message = "Invalid input") { super(400, message); }
}
class NotFoundError extends AppError {
    constructor(message = "Not found") { super(404, message); }
}
class ConflictError extends AppError {
    constructor(message = "Conflict") { super(409, message); }
}

class UnauthorizedError extends AppError { 
    constructor(m = "Authentication required") { super(401, m); } 
}
class ForbiddenError extends AppError { 
    constructor(m = "Forbidden") { super(403, m); } 
}

module.exports = { 
    AppError, ValidationError, NotFoundError, ConflictError,
    UnauthorizedError, ForbiddenError
};