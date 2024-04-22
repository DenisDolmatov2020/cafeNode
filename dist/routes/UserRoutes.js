"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const UserRouter = (0, express_1.Router)();
UserRouter.get('/', user_controller_1.default.getAll);
UserRouter.post('/login', user_controller_1.default.login);
UserRouter.post('/registration', user_controller_1.default.registration);
exports.default = UserRouter;
