"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class CryptoService {
    constructor() {
        this.generateAccessToken = (id) => {
            return jsonwebtoken_1.default.sign({ id }, '123', { expiresIn: '24h' });
        };
    }
}
exports.default = new CryptoService();
