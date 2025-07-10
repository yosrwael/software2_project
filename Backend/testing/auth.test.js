const mongoose = require('mongoose');
const app = require('../app');
const userModel = require('../models/user');
const request = require('supertest');
require('dotenv').config({
    path: 'E:\\Downloads\\SOFTWARE2_project-master\\SOFTWARE2_project-master\\SWE2-Project-master\\Backend\\.env'
});

beforeEach(async () => {
    await mongoose.connect(process.env.connect_DB);
});

afterAll(async () => {
    await userModel.deleteMany({ isTest: true });
    await mongoose.connection.close();
});

describe('register', () => {
    it('should register a new user', async () => {
        const res = await request(app).post('/register').send({
            firstName: "Karim",
            lastName: "Mostafa",
            mobile: "01011122233",
            gender: "male",
            username: "Karim",
            email: "karim@gmail.com",
            password: "505050",
            confirmPassword: "505050",
            isAdmin:true,
            isTest: true,
        });
        expect(res.status).toBe(302);  // تم التعديل على الـ status code ليكون 302 لأنه سيكون إعادة توجيه
        expect(res.headers.location).toBe("/home");  // تأكد من التوجيه للصفحة الرئيسية بعد النجاح
    });

    it('should return failure if the user already exists', async () => {
        const res = await request(app).post('/register').send({
            firstName: "Karim",
            lastName: "Mostafa",
            mobile: "01011122233",
            gender: "male",
            username: "Karim",
            email: "karim@gmail.com",
            password: "505050",
            confirmPassword: "505050",
            isAdmin:true,
            isTest: true,
        });
        expect(res.status).toBe(302);  // إعادة التوجيه في حال وجود المستخدم بالفعل
        expect(res.headers.location).toContain("/register?error=User+already+exists");
    });
    it('should redirect with error when required fields are missing', async () => {
    const res = await request(app).post('/register').send({
        // Missing multiple required fields
        firstName: "Test",
        lastName: "test9@example.com"
        // no lastName, mobile, gender, username, password, confirmPassword
    });

    expect(res.status).toBe(400);
expect(res.body.errors[0].msg).toBe('There is problem in email!!'); // أو أي رسالة متوقعة من الفاليديشن

});
it('should redirect with error when passwords do not match', async () => {
    const res = await request(app).post('/register').send({
        firstName: "Test",
        lastName: "User",
        mobile: "9999999999",
        gender: "male",
        username: "testuser",
        email: "test8@example.com",
        password: "password123",
        confirmPassword: "password456", // mismatch
        isAdmin:true
    });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/register?error=Passwords+do+not+match');
});

});

describe('login', () => {
    it('should return failure if the password is incorrect', async () => {
        const res = await request(app).post('/login').send({
            email: "karim@gmail.com",
            password: "606060",
        });
        expect(res.status).toBe(302);  // إعادة توجيه في حالة الفشل
        expect(res.headers.location).toContain('/login?error=Invalid+email+or+password');
    });

    it('should return failure if the email is invalid', async () => {
        const res = await request(app).post('/login').send({
            email: "invalidEmail@gmail.com",
            password: "202020",
        });
        expect(res.status).toBe(302);  // إعادة توجيه في حالة الفشل
        expect(res.headers.location).toContain('/login?error=Invalid+email+or+password');
    });
});


describe('logout', () => {
    it('should logout from the system', async () => {
        const res = await request(app).get('/logout');
        expect(res.status).toBe(302); // تسجيل خروج = redirect
    });
});
