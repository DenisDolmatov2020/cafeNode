import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { Request, Response } from 'express';
import CryptoService from '../services/crypto.service';
import { PrismaClient } from '../../prisma/generated/client';

const prisma = new PrismaClient();

class UserController {
    async getAll(req: Request, res: Response) {
        const users = await prisma.user.findMany();
        res.json(users);
    }

    async login(req: Request, res: Response) {
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

            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ message: 'Email and password mismatch' });
            }

            const token = CryptoService.generateAccessToken(String(user.id));
            return res.json({ token });
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: 'Login error' });
        }
    }

    async registration(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
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

            const hashPassword = bcrypt.hashSync(password, 10);

            await prisma.user.create({ data: { email, name, password: hashPassword }});
            return res.status(200).send({ message: 'Email registered successfully' });
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ message: (error as Error).message });
        }
    }
    /*

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({ message: `User with email ${email} not found` });
            }

            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ message: 'Email and password mismatch' });
            }

            const token = CryptoService.generateAccessToken(user.id);
            return res.json({ token });
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: 'login error' });
        }
    }

    async confirmEmail(req: Request, res: Response) {
        try {
            const { email } = req.query;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            if (user.confirmed) {
                return res.status(400).send({ message: 'Email already confirmed' });
            }

            // Update confirmation user in DB
            user.set('confirmed', true);
            await user.save();

            return res.status(200).send({ message: 'Email confirmed successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: 'Server error' });
        }
    }

    async profile(req: Request, res: Response) {
        try {
            // Найти пользователя по идентификатору, сохраненному в поле userId в токене
            const user = await User.findOne({ id: req.userId });
            // Возвращаем только необходимые данные пользователя
            const { username, email, confirmed } = user;
            res.status(200).json({ username, email, confirmed });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error', error });
        }
    }

     */
}

export default new UserController();
