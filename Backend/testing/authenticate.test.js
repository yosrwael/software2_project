const express = require('express');
const session = require('express-session');
const request = require('supertest');
const isAuthenticated = require('../middlewares/authenticate'); // غيّر المسار حسب مكان الملف

const app = express();

app.use(express.json());
app.use(session({
    secret: 'testsecret',
    resave: false,
    saveUninitialized: true
}));

// ✅ الراوت دا لازم يكون قبل التست
app.get('/set-session', (req, res) => {
    req.session.user = { id: '123', name: 'TestUser' };
    res.status(200).end();
});

// الراوت المحمي
app.get('/protected', isAuthenticated, (req, res) => {
    res.status(200).json({ message: 'Access granted' });
});

describe('isAuthenticated middleware', () => {

    it('should allow access if user is authenticated', async () => {
        const agent = request.agent(app); // يحفظ السيشن

        await agent.get('/set-session'); // جلسة تسجل

        const res = await agent.get('/protected'); // يفترض يعدي
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Access granted');
    });

    it('should deny access if user is not authenticated', async () => {
        const res = await request(app).get('/protected');
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Unauthorized');
    });

});
