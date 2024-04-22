import jwt from 'jsonwebtoken';

class CryptoService {
    generateAccessToken = (id: string): string => {
        return jwt.sign({ id }, '123', { expiresIn: '24h' });
    }
}

export default new CryptoService();
