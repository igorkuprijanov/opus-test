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
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
const handlebars_1 = __importDefault(require("handlebars"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
var EmailService;
(function (EmailService) {
    let activationMail = handlebars_1.default.compile(fs_1.default.readFileSync(path_1.default.join(__dirname, './emailTemplates/activation-template.hbs'), 'utf8'));
    let resetPasswordMail = handlebars_1.default.compile(fs_1.default.readFileSync(path_1.default.join(__dirname, './emailTemplates/password-reset.hbs'), 'utf8'));
    let userDeletedMail = handlebars_1.default.compile(fs_1.default.readFileSync(path_1.default.join(__dirname, './emailTemplates/user-deleted.hbs'), 'utf8'));
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
        debug: false,
    });
    const options = (to, subject, template, locals) => {
        return {
            from: 'SpaR8ZnwST@gmail.com',
            to: to,
            subject: subject,
            html: template(locals),
        };
    };
    function sendActivation(to, link) {
        return __awaiter(this, void 0, void 0, function* () {
            transporter.sendMail(options(to, 'Account activation', activationMail, { link }), (error) => {
                if (error) {
                    console.log(error);
                }
            });
        });
    }
    EmailService.sendActivation = sendActivation;
    function sendRestore(to, pass) {
        return __awaiter(this, void 0, void 0, function* () {
            transporter.sendMail(options(to, 'Restore password', resetPasswordMail, { pass }), (error) => {
                if (error) {
                    console.log(error);
                }
            });
        });
    }
    EmailService.sendRestore = sendRestore;
    function userDeleted(to) {
        return __awaiter(this, void 0, void 0, function* () {
            transporter.sendMail(options(to, 'User deleted', userDeletedMail, { to }), (error) => {
                if (error) {
                    console.log(error);
                }
            });
        });
    }
    EmailService.userDeleted = userDeleted;
})(EmailService = exports.EmailService || (exports.EmailService = {}));
