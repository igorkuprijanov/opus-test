"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_services_1 = require("./data-services");
var TokenService;
(function (TokenService) {
    function generateTokens(payload) {
        let accessToken = jsonwebtoken_1.default.sign({ payload }, process.env.JWT_ACCESS_SECRET, { expiresIn: '5s' });
        let refreshToken = jsonwebtoken_1.default.sign({ payload }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken,
        };
    }
    TokenService.generateTokens = generateTokens;
    function removeToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = data_services_1.DataServices.deleteRefreshToken(refreshToken);
            return token;
        });
    }
    TokenService.removeToken = removeToken;
    function validateToken(token) {
        try {
            let userData = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        }
        catch (e) {
            return null;
        }
    }
    TokenService.validateToken = validateToken;
    function validateRefreshToken(token) {
        try {
            let userData = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        }
        catch (e) {
            return null;
        }
    }
    TokenService.validateRefreshToken = validateRefreshToken;
})(TokenService = exports.TokenService || (exports.TokenService = {}));
