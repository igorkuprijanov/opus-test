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
exports.UserServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const email_services_1 = require("./email-services");
const token_services_1 = require("./token-services");
const data_services_1 = require("./data-services");
const api_error_1 = require("../exceptions/api-error");
var UserServices;
(function (UserServices) {
    function registration(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let candidate = data_services_1.DataServices.getOneUser(email);
            if (candidate != null) {
                throw api_error_1.Errors.ApiError.BadRequest({ head: 'User already exists', body: 'This email is already in use, either use another email or use the restore password form.' });
            }
            else {
                let hashPassword = yield bcrypt_1.default.hash(password, 3);
                let activationLink = (0, uuid_1.v4)();
                let user = { email, hashPassword, isActive: false, activationLink, logs: [`Registered: ${new Date()}`] };
                yield email_services_1.EmailService.sendActivation(email, `${process.env.API_URL}/activate/${activationLink}`);
                data_services_1.DataServices.addUser(JSON.stringify({ user }));
                return { user };
            }
        });
    }
    UserServices.registration = registration;
    function login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = data_services_1.DataServices.getOneUser(email);
            if (!user) {
                throw api_error_1.Errors.ApiError.BadRequest({ head: 'Error', body: 'No such user found' });
            }
            let isPassEqual = yield bcrypt_1.default.compare(password, user.user.hashPassword);
            if (!isPassEqual) {
                throw api_error_1.Errors.ApiError.BadRequest({ head: 'Error', body: 'Wrong password' });
            }
            let data = { email: user.user.email, isActive: user.user.isActive };
            let tokens = token_services_1.TokenService.generateTokens(email);
            data_services_1.DataServices.createTokens(user, tokens);
            return Object.assign(Object.assign({}, tokens), { status: true, data });
        });
    }
    UserServices.login = login;
    function activate(activationLink) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                data_services_1.DataServices.activateUser(activationLink);
            }
            catch (e) {
                throw api_error_1.Errors.ApiError.BadRequest(e);
            }
        });
    }
    UserServices.activate = activate;
    function logOut(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = yield token_services_1.TokenService.removeToken(refreshToken);
            return token;
        });
    }
    UserServices.logOut = logOut;
    function refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                throw api_error_1.Errors.ApiError.UnauthorizedError();
            }
            let userData = token_services_1.TokenService.validateRefreshToken(refreshToken);
            let { user, tokens } = data_services_1.DataServices.findToken(refreshToken);
            if (!userData || !tokens.refreshToken) {
                throw api_error_1.Errors.ApiError.UnauthorizedError();
            }
            let newTokens = token_services_1.TokenService.generateTokens(user.email);
            data_services_1.DataServices.refreshToken(refreshToken, newTokens);
            return { newTokens, user };
        });
    }
    UserServices.refresh = refresh;
    function getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            let allUsers = data_services_1.DataServices.getAllUsers();
            let users = [];
            allUsers.forEach((user) => {
                users.push({ name: user.user.email, logs: user.user.logs });
            });
            return users;
        });
    }
    UserServices.getUsers = getUsers;
    function generateRandomPassword() {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 10; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
    function restore(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let newPassword = generateRandomPassword();
            yield data_services_1.DataServices.changePassword(email, newPassword);
            email_services_1.EmailService.sendRestore(email, newPassword);
        });
    }
    UserServices.restore = restore;
    function deleteUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            data_services_1.DataServices.deleteUser(email);
            email_services_1.EmailService.userDeleted(email);
        });
    }
    UserServices.deleteUser = deleteUser;
})(UserServices = exports.UserServices || (exports.UserServices = {}));
