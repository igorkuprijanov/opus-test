"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const api_error_1 = require("../exceptions/api-error");
const token_services_1 = require("../services/token-services");
var AuthMiddleware;
(function (AuthMiddleware) {
    function handleAuth(req, res, next) {
        try {
            let authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                return next(api_error_1.Errors.ApiError.UnauthorizedError());
            }
            let accessToken = authorizationHeader.split(' ')[1];
            if (!accessToken) {
                return next(api_error_1.Errors.ApiError.UnauthorizedError());
            }
            let userData = token_services_1.TokenService.validateToken(accessToken);
            if (!userData) {
                return next(api_error_1.Errors.ApiError.UnauthorizedError());
            }
            req.user = userData;
            console.log('AUTHORIZED');
            next();
        }
        catch (e) {
            return next(api_error_1.Errors.ApiError.UnauthorizedError());
        }
    }
    AuthMiddleware.handleAuth = handleAuth;
})(AuthMiddleware = exports.AuthMiddleware || (exports.AuthMiddleware = {}));
