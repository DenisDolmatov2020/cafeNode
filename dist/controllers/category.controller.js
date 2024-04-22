"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../../prisma/generated/client");
const prisma = new client_1.PrismaClient();
class CategoryController {
    constructor() {
        this.getCategoryTree = this.getCategoryTree.bind(this);
        this.getAllCategoriesWithItems = this.getAllCategoriesWithItems.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getCategories = this.getCategories.bind(this);
        this.createCategory = this.createCategory.bind(this);
        this.updateCategory = this.updateCategory.bind(this);
    }
    async getCategoryTree(categoryId = null) {
        const categories = await prisma.category.findMany({
            where: { parentCategoryId: categoryId },
            include: {
                items: { select: { id: true, title: true, price: true } },
                childCategories: { include: { items: { select: { id: true, title: true } } } },
            },
        });
        return Promise.all(categories.map(async (category) => ({
            id: category.id,
            title: category.title,
            items: category.items,
            childCategories: await this.getCategoryTree(category.id),
        })));
    }
    async getAllCategoriesWithItems(req, res) {
        try {
            const categoryTree = await this.getCategoryTree();
            return res.status(200).json(categoryTree);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    async getAll(req, res) {
        const categories = await prisma.category.findMany();
        res.json(categories);
    }
    async getCategories(req, res) {
        try {
            const { parentCategoryId } = req.params;
            let whereClause = {};
            if (parentCategoryId && parentCategoryId !== 'all') {
                if (parentCategoryId === 'withoutParent') {
                    whereClause = {
                        parentCategory: null,
                    };
                }
                else {
                    whereClause = {
                        parentCategory: {
                            id: +parentCategoryId,
                        },
                    };
                }
            }
            const categories = await prisma.category.findMany({
                where: whereClause,
            });
            return res.status(200).json(categories);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    async createCategory(req, res) {
        try {
            const createdData = await prisma.category.create({
                data: {
                    ...req.body,
                    user: {
                        connect: {
                            id: +req.body.user
                        }
                    },
                    parentCategory: req.body.parentCategory
                        ? {
                            connect: {
                                id: +req.body.parentCategory
                            }
                        }
                        : undefined,
                }
            });
            return res.status(201).send({ message: 'Category created successfully', data: createdData });
        }
        catch (error) {
            console.error(error);
            return res.status(400).json({ message: 'Error creating category' });
        }
    }
    async updateCategory(req, res) {
        try {
            const categoryId = +req.params.id;
            const updatedData = await prisma.category.update({
                where: {
                    id: categoryId,
                },
                data: {
                    ...req.body,
                    parentCategory: req.body.parentCategory
                        ? {
                            connect: {
                                id: +req.body.parentCategory,
                            },
                        }
                        : undefined,
                    user: {
                        connect: {
                            id: +req.body.user
                        }
                    }
                },
            });
            return res.status(200).send({ message: 'Category updated successfully', data: updatedData });
        }
        catch (error) {
            console.error(error);
            return res.status(400).json({ message: 'Error updating category' });
        }
    }
}
exports.default = new CategoryController();
