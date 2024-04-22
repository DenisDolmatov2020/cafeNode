"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../../prisma/generated/client");
const file_service_1 = __importDefault(require("../services/file.service"));
const prisma = new client_1.PrismaClient();
class ItemController {
    async getAll(req, res) {
        const items = await prisma.item.findMany();
        res.json(items);
    }
    async getItemsByCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const items = await prisma.item.findMany({
                where: {
                    categories: {
                        some: {
                            id: +categoryId,
                        },
                    },
                },
            });
            return res.status(200).json(items);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    async createItem(req, res) {
        try {
            const categories = req.body.categories || [];
            const imageFileName = await file_service_1.default.saveFile(req, res); // Сохранение файла
            const createdData = await prisma.item.create({
                data: {
                    ...req.body,
                    image: imageFileName, // Сохраняем имя файла в модели
                    user: {
                        connect: {
                            id: +req.body.user,
                        },
                    },
                    categories: {
                        connect: categories.map((categoryId) => ({
                            id: +categoryId,
                        })),
                    },
                },
            });
            return res.status(201).send({ message: 'Item created successfully', data: createdData });
        }
        catch (error) {
            console.error(error);
            return res.status(400).json({ message: 'Error creating item' });
        }
    }
    ;
    async updateItem(req, res) {
        try {
            const itemId = +req.params.id;
            const categories = req.body.categories || [];
            const updatedData = await prisma.item.update({
                where: {
                    id: itemId,
                },
                data: {
                    ...req.body,
                    categories: {
                        set: categories.map((categoryId) => ({
                            id: +categoryId
                        }))
                    },
                    user: {
                        connect: {
                            id: +req.body.user
                        }
                    }
                },
            });
            return res.status(200).send({ message: 'Item updated successfully', data: updatedData });
        }
        catch (error) {
            console.error(error);
            return res.status(400).json({ message: 'Error updating item' });
        }
    }
}
exports.default = new ItemController();
