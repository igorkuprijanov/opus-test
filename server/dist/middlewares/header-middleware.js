"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderMiddleware = void 0;
var HeaderMiddleware;
(function (HeaderMiddleware) {
    function handleHeader(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        next();
    }
    HeaderMiddleware.handleHeader = handleHeader;
})(HeaderMiddleware = exports.HeaderMiddleware || (exports.HeaderMiddleware = {}));
