"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = __importDefault(require("../controllers/category.controller"));
const userMiddleware_1 = __importDefault(require("../middlewares/userMiddleware"));
const CategoryRouter = (0, express_1.Router)();
CategoryRouter.get('/tree', category_controller_1.default.getAllCategoriesWithItems);
CategoryRouter.get('/', category_controller_1.default.getAll);
CategoryRouter.get('/:parentCategoryId', category_controller_1.default.getCategories);
CategoryRouter.post('/', userMiddleware_1.default, category_controller_1.default.createCategory);
CategoryRouter.patch('/:id', userMiddleware_1.default, category_controller_1.default.updateCategory);
exports.default = CategoryRouter;
