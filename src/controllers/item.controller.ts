import { Request, Response } from 'express';
import { PrismaClient } from '../../prisma/generated/client';
import FileService from '../services/file.service';

const prisma = new PrismaClient();

class ItemController {
    async getAll(req: Request, res: Response) {
        const items = await prisma.item.findMany();
        res.json(items);
    }

    async getItemsByCategory(req: Request, res: Response) {
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
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async createItem(req: Request, res: Response) {
        try {
            const categories = req.body.categories || [];
            const imageFileName = await FileService.saveFile(req, res); // Сохранение файла

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
                        connect: categories.map((categoryId: string) => ({
                            id: +categoryId,
                        })),
                    },
                },
            });

            return res.status(201).send({ message: 'Item created successfully', data: createdData });
        } catch (error: any) {
            console.error(error);
            return res.status(400).json({ message: 'Error creating item' });
        }
    };

    async updateItem(req: Request, res: Response) {
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
                        set: categories.map((categoryId: string) => ({
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
        } catch (error: any) {
            console.error(error);
            return res.status(400).json({ message: 'Error updating item' });
        }
    }
}

export default new ItemController();
