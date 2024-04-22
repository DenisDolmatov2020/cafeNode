"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
const crypto_service_1 = __importDefault(require("../services/crypto.service"));
const client_1 = require("../../prisma/generated/client");
const prisma = new client_1.PrismaClient();
class UserController {
    async getAll(req, res) {
        const users = await prisma.user.findMany();
        res.json(users);
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await prisma.user.findUnique({
                where: {
                    email
                }
            });
            if (!user) {
                return res.status(401).json({ message: `User with email ${email} not found` });
            }
            const validPassword = bcryptjs_1.default.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ message: 'Email and password mismatch' });
            }
            const token = crypto_service_1.default.generateAccessToken(String(user.id));
            return res.json({ token });
        }
        catch (error) {
            console.error(error);
            res.status(400).json({ message: 'Login error' });
        }
    }
    async registration(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors });
            }
            const { email, name, password } = req.body;
            const user = await prisma.user.findUnique({
                where: {
                    email
                }
            });
            if (user) {
                return res.status(409).send({ message: 'User created before' });
            }
            const hashPassword = bcryptjs_1.default.hashSync(password, 10);
            await prisma.user.create({ data: { email, name, password: hashPassword } });
            return res.status(200).send({ message: 'Email registered successfully' });
        }
        catch (error) {
            console.error(error);
            res.status(400).json({ message: error.message });
        }
    }
}
exports.default = new UserController();
