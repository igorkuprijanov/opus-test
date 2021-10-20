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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataServices = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const api_error_1 = require("../exceptions/api-error");
const bcrypt_1 = __importDefault(require("bcrypt"));
//write new data function would be nice
let file = path_1.default.resolve(__dirname, '../userData.json');
if (!fs_1.default.existsSync(file)) {
    fs_1.default.appendFileSync(path_1.default.resolve(__dirname, '../userData.json'), '{"users":[]}');
}
var DataServices;
(function (DataServices) {
    let rawData = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../userData.json'));
    let userData = JSON.parse(rawData.toString('utf8'));
    function getOneUser(email) {
        let user = userData.users.find((user) => { return user.user.email === email ? user : null; });
        return user;
    }
    DataServices.getOneUser = getOneUser;
    function getAllUsers() {
        return userData.users;
    }
    DataServices.getAllUsers = getAllUsers;
    function addUser(newUser) {
        userData.users.push(JSON.parse(newUser));
        let newRawData = Buffer.from(JSON.stringify(userData));
        fs_1.default.writeFileSync(path_1.default.resolve(__dirname, '../userData.json'), newRawData, { encoding: 'utf8' });
    }
    DataServices.addUser = addUser;
    function activateUser(activationLink) {
        let modifiableUser = userData.users.find((user) => { return user.user.activationLink === activationLink ? user : null; });
        if (!modifiableUser) {
            throw api_error_1.Errors.ApiError.BadRequest({ head: 'Error', body: 'No user with such validation link' });
        }
        else if (modifiableUser.user.isActive) {
            throw api_error_1.Errors.ApiError.BadRequest({ head: 'Error', body: 'User already active' });
        }
        modifiableUser.user.isActive = true;
        modifiableUser.user.logs.push(`Activated: ${new Date()}`);
        userData.users.splice(userData.users.indexOf(modifiableUser), 1);
        userData.users.push(modifiableUser);
        let newRawData = Buffer.from(JSON.stringify(userData));
        fs_1.default.writeFileSync(path_1.default.resolve(__dirname, '../userData.json'), newRawData, { encoding: 'utf8' });
    }
    DataServices.activateUser = activateUser;
    function deleteUser(email) {
        let target = getOneUser(email);
        if (!target) {
            throw api_error_1.Errors.ApiError.BadRequest({ head: 'Error', body: 'User does not exist' });
        }
        userData.users.splice(userData.users.indexOf(target), 1);
        let newRawData = Buffer.from(JSON.stringify(userData));
        fs_1.default.writeFileSync(path_1.default.resolve(__dirname, '../userData.json'), newRawData, { encoding: 'utf8' });
    }
    DataServices.deleteUser = deleteUser;
    function changePassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = getOneUser(email);
            if (!user) {
                throw api_error_1.Errors.ApiError.BadRequest({ head: 'Error', body: 'No user with this email found' });
            }
            user.user.hashPassword = yield bcrypt_1.default.hash(newPassword, 3);
            user.user.logs.push(`Password changed: ${new Date()}`);
            userData.users.splice(userData.users.indexOf(user), 1);
            userData.users.push(user);
            let newRawData = Buffer.from(JSON.stringify(userData));
            fs_1.default.writeFileSync(path_1.default.resolve(__dirname, '../userData.json'), newRawData, { encoding: 'utf8' });
        });
    }
    DataServices.changePassword = changePassword;
    function createTokens(target, tokens) {
        userData.users.splice(userData.users.indexOf(target), 1);
        target.user.logs.push(`Login: ${new Date()}`);
        userData.users.push(Object.assign(Object.assign({}, target), { tokens }));
        let newRawData = Buffer.from(JSON.stringify(userData));
        fs_1.default.writeFileSync(path_1.default.resolve(__dirname, '../userData.json'), newRawData, { encoding: 'utf8' });
    }
    DataServices.createTokens = createTokens;
    function deleteRefreshToken(refreshToken) {
        let user = userData.users.find((user) => { var _a; return ((_a = user.tokens) === null || _a === void 0 ? void 0 : _a.refreshToken) === refreshToken ? user : null; });
        if (!refreshToken) {
            throw api_error_1.Errors.ApiError.BadRequest({ head: 'Error', body: 'User with this token not found' });
        }
        let _a = userData.users[userData.users.indexOf(user)], { tokens } = _a, newUser = __rest(_a, ["tokens"]);
        newUser.user.logs.push(`Logout: ${new Date()}`);
        userData.users.splice(userData.users.indexOf(user), 1);
        userData.users.push(newUser);
        let newRawData = Buffer.from(JSON.stringify(userData));
        fs_1.default.writeFileSync(path_1.default.resolve(__dirname, '../userData.json'), newRawData, { encoding: 'utf8' });
        return (tokens.refreshToken);
    }
    DataServices.deleteRefreshToken = deleteRefreshToken;
    function findToken(token) {
        let data = userData.users.find((user) => { var _a; return ((_a = user.tokens) === null || _a === void 0 ? void 0 : _a.refreshToken) === token ? user : null; });
        return data;
    }
    DataServices.findToken = findToken;
    function refreshToken(token, newTokens) {
        let user = userData.users.find((user) => { var _a; return ((_a = user.tokens) === null || _a === void 0 ? void 0 : _a.refreshToken) === token ? user : null; });
        let tokens = newTokens;
        userData.users.splice(userData.users.indexOf(user), 1);
        userData.users.push({ user: user.user, tokens: tokens });
        let newRawData = Buffer.from(JSON.stringify(userData));
        fs_1.default.writeFileSync(path_1.default.resolve(__dirname, '../userData.json'), newRawData, { encoding: 'utf8' });
    }
    DataServices.refreshToken = refreshToken;
})(DataServices = exports.DataServices || (exports.DataServices = {}));
