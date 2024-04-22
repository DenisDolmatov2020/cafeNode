"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userMiddleware = (req, res, next) => {
    console.log('req middle', req);
    if (req.method === 'OPTIONS') {
        next();
        return; // Explicitly return here to satisfy TypeScript
    }
    try {
        let tokenArray = [];
        if (req.headers.authorization != null) {
            tokenArray = req.headers.authorization.split(' ');
        }
        const token = tokenArray?.[1];
        if (!token) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        const decodedData = jsonwebtoken_1.default.verify(token, '123');
        req.body.user = decodedData.id;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ message: 'Error authorization' });
    }
};
exports.default = userMiddleware;
