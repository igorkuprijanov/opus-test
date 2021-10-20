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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_services_1 = require("../services/user-services");
const express_validator_1 = require("express-validator");
const api_error_1 = require("../exceptions/api-error");
var UserController;
(function (UserController) {
    const restorePasswordMessage = { status: true, data: { head: 'Success', body: 'A new password has been sent to your email' } };
    const userDeletedMessage = { status: true, data: { head: 'Success', body: 'User has been deleted' } };
    const registrationMessage = { status: true, data: { head: 'Success', body: 'User has been created, a conformation message has been sent to your email. Please confirm the registration and log in.' } };
    function registration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return next(api_error_1.Errors.ApiError.BadRequest({ head: 'Error', body: 'Check the form correctenss' }, errors.array()));
                }
                let { email, password } = req.body;
                yield user_services_1.UserServices.registration(email, password);
                return res.send(registrationMessage);
            }
            catch (e) {
                next(e);
            }
        });
    }
    UserController.registration = registration;
    function login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, password } = req.body;
                let userData = yield user_services_1.UserServices.login(email, password);
                return res.send(userData);
            }
            catch (e) {
                next(e);
            }
        });
    }
    UserController.login = login;
    function activate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let activationLink = req.params.link;
                user_services_1.UserServices.activate(activationLink);
                return res.redirect(process.env.CLIENT_URL);
            }
            catch (e) {
                next(e);
            }
        });
    }
    UserController.activate = activate;
    function logOut(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { refreshToken } = req.body;
                let token = yield user_services_1.UserServices.logOut(refreshToken);
                return res.json(token);
            }
            catch (e) {
                next(e);
            }
        });
    }
    UserController.logOut = logOut;
    function refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.body;
                const userData = yield user_services_1.UserServices.refresh(refreshToken);
                return res.json(userData);
            }
            catch (e) {
                next(e);
            }
        });
    }
    UserController.refresh = refresh;
    function getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let allUsers = yield user_services_1.UserServices.getUsers();
                return res.json(allUsers);
            }
            catch (e) {
                next(e);
            }
        });
    }
    UserController.getUsers = getUsers;
    function deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let email = req.body.email;
                user_services_1.UserServices.deleteUser(email);
                return res.send(userDeletedMessage);
            }
            catch (e) {
                next(e);
            }
        });
    }
    UserController.deleteUser = deleteUser;
    function restore(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let email = req.body.email;
                yield user_services_1.UserServices.restore(email);
                return res.send(restorePasswordMessage);
            }
            catch (e) {
                next(e);
            }
        });
    }
    UserController.restore = restore;
})(UserController = exports.UserController || (exports.UserController = {}));
