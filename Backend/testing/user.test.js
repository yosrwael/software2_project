const mongoose = require("mongoose");
const app = require("../app");
const userModel = require("../models/user");
const request = require("supertest");

require("dotenv").config(
  '{ path: "E:DownloadsSOFTWARE2_project-masterSOFTWARE2_project-masterSWE2-Project-masterBackend" }'
);

beforeAll(async () => {
  await mongoose.connect(process.env.connect_DB);
});

afterAll(async () => {
  await userModel.deleteMany({ isTest: true });
  await mongoose.connection.close();
});

describe("get all users", () => {
  it("should return all users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
  }),
    it("should return failure with status code 500", async () => {
      await mongoose.connection.close(); // we can do this or we can use mocking
      const res = await request(app).get("/api/users");
      expect(res.status).toBe(500);
      await mongoose.connect(process.env.connect_DB);
    });
});

describe("get a user", () => {
  it("should return a user", async () => {
    const user = await userModel.create({
      firstName: "Hager",
      lastName: "Taher",
      mobile: "01096514357",
      gender: "female",
      username: "hager",
      email: "hager@gmail.com",
      password: "123456",
      confirmPassword: "123456",
      isAdmin: true,
      isTest: true,
    });
    const res = await request(app).get(`/api/users/${user._id}`);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("hager");
  }),
    it("should return user not found", async () => {
      const res = await request(app).get(`/api/users/5050221`);
      expect(res.status).toBe(500);
    });
});

describe("post a user", () => {
  it("should create a user", async () => {
    const res = await request(app).post(`/api/users`).send({
      firstName: "y",
      lastName: "wael",
      mobile: "01096514357",
      gender: "female",
      username: "yosr",
      email: "yosr2@gmail.com",
      password: "123456",
      confirmPassword: "123456",
      isAdmin: true,
      isTest: true,
    });
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("yosr");
  }),
    it("should fail to create a user", async () => {
      const res = await request(app).post("/api/users");
      expect(res.status).toBe(500);
    });
});

describe("update a user", () => {
  it("should update a user", async () => {
    const user = await userModel.create({
      firstName: "test",
      lastName: "test",
      mobile: "1111111111",
      gender: "male",
      username: "test",
      email: "test@gmail.com",
      password: "123456",
      confirmPassword: "123456",
      isAdmin: true,
      isTest: true,
    });
    const res = await request(app).put(`/api/users/${user._id}`).send({
      firstName: "t",
      lastName: "i",
      mobile: "111111111",
      gender: "male",
      username: "test",
      email: "test7@gmail.com",
      password: "232323",
      confirmPassword: "232323",
      isAdmin: true,
    });
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("test");
  }),
    it("should update a user without changing username (no username field)", async () => {
      const user = await userModel.create({
        firstName: "test2",
        lastName: "t",
        mobile: "9999999999",
        gender: "male",
        username: "test",
        email: "user10@gmail.com",
        password: "505050",
        confirmPassword: "505050",
        isTest: true,
      });

      const res = await request(app).put(`/api/users/${user._id}`).send({
        firstName: "test2",
      });

      expect(res.status).toBe(200);
      expect(res.body.firstName).toBe("test2");
      expect(res.body.username).toBe("test");
    }),
    it("should return user not found", async () => {
      const res = await request(app).put(`/api/users/5d4f54d`).send({
        password: "8855885",
      });
      expect(res.status).toBe(500);
    });
});

describe("delete a user", () => {
  it("should delete a user", async () => {
    const user = await userModel.create({
      firstName: "test3",
      lastName: "bjsdkc",
      mobile: "999999999",
      gender: "male",
      username: "test3",
      email: "test8@gmail.com",
      password: "505050",
      confirmPassword: "505050",
      isTest: true,
    });
    const res = await request(app).delete(`/api/users/${user._id}`);
    expect(res.status).toBe(200);
  }),
    it("should return user not found", async () => {
      const res = await request(app).delete("/api/users/45544");
      expect(res.status).toBe(500);
    });
});
