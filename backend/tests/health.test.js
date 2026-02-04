const request = require('supertest');
const app = require('../server');
const db = require('../config/db');

// Mock database to avoid connection attempts during health check if it depends on it
// Although /health doesn't use DB, we mock to be safe and prevent side effects
jest.mock('../config/db', () => ({
    query: jest.fn(),
    pool: {
        connect: jest.fn(),
        on: jest.fn(),
    }
}));

describe('Health Check Endpoint', () => {
    it('should return 200 and success message', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Newt Tracker API is running');
    });
});
