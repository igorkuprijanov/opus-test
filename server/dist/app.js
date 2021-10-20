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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./router/routes"));
require("dotenv/config");
const error_middleware_1 = require("./middlewares/error-middleware");
const header_middleware_1 = require("./middlewares/header-middleware");
const app = (0, express_1.default)();
app.use(header_middleware_1.HeaderMiddleware.handleHeader);
app.use('/', routes_1.default);
app.use((0, cors_1.default)());
app.use(error_middleware_1.ErrMiddleware.handleError);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        app.listen(process.env.PORT || 4000, () => console.log(`server is running on ${process.env.PORT}`));
    }
    catch (e) {
        console.log(e);
    }
});
start();
