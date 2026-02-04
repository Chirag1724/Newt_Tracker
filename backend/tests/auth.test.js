const request = require('supertest');
const app = require('../server');

// Mock dependencies
jest.mock('../config/db', () => ({
    query: jest.fn(),
    pool: {
        connect: jest.fn(),
        on: jest.fn(),
    }
}));

jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
    genSalt: jest.fn(),
    hash: jest.fn()
}));

const db = require('../config/db');
const bcrypt = require('bcryptjs');

describe('Auth Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = 'test_secret';
    });

    describe('POST /api/auth/register', () => {
        it('should return 400 if required fields are missing', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ name: 'Test User' });

            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should return 400 if email or password missing', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com' });

            expect(res.statusCode).toEqual(400);
        });

        it('should return 200 and token on valid login', async () => {
            // Mock DB: User found
            db.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'hashed_password',
                    role: 'admin',
                    created_at: new Date()
                }]
            });

            // Mock Bcrypt: Password valid
            bcrypt.compare.mockResolvedValue(true);

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'password123' });

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body).toHaveProperty('token');
        });

        it('should return 401 on invalid credential', async () => {
            // Mock DB: User found
            db.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    email: 'test@example.com',
                    password: 'hashed_password'
                }]
            });

            // Mock Bcrypt: Password Invalid
            bcrypt.compare.mockResolvedValue(false);

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'wrongpassword' });

            expect(res.statusCode).toEqual(401);
        });
    });
});
