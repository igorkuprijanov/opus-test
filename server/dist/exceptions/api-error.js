"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = void 0;
var Errors;
(function (Errors) {
    class ApiError extends Error {
        constructor(code, status, data, errors) {
            super();
            this.code = code;
            this.data = data;
            this.errors = errors;
            this.status = status;
        }
        static UnauthorizedError() {
            return new ApiError(401, false, { head: 'Authorization error', body: 'User is not authorized' });
        }
        static BadRequest(data, errors) {
            return new ApiError(400, false, data, errors);
        }
    }
    Errors.ApiError = ApiError;
})(Errors = exports.Errors || (exports.Errors = {}));
