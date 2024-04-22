"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const item_controller_1 = __importDefault(require("../controllers/item.controller"));
const userMiddleware_1 = __importDefault(require("../middlewares/userMiddleware"));
const ItemRoutes = (0, express_1.Router)();
ItemRoutes.get('/', item_controller_1.default.getAll);
ItemRoutes.get('/:categoryId', item_controller_1.default.getItemsByCategory);
ItemRoutes.post('/', userMiddleware_1.default, item_controller_1.default.createItem);
ItemRoutes.patch('/:id', userMiddleware_1.default, item_controller_1.default.updateItem);
exports.default = ItemRoutes;
