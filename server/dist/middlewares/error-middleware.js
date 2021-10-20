"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrMiddleware = void 0;
const api_error_1 = require("../exceptions/api-error");
var ErrMiddleware;
(function (ErrMiddleware) {
    function handleError(err, req, res, next) {
        console.log(err);
        if (err instanceof api_error_1.Errors.ApiError) {
            return res.status(err.code).send(err);
        }
        return res.status(500).json({ head: 'server error', body: 'internal server error' });
    }
    ErrMiddleware.handleError = handleError;
})(ErrMiddleware = exports.ErrMiddleware || (exports.ErrMiddleware = {}));
