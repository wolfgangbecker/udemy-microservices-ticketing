import request from "supertest";
import { app } from "../../app";

it("returns 400 if the user doesn't exist", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with missing email or password", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      password: "password",
    })
    .expect(400);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
    })
    .expect(400);
});

describe("when the user exists", () => {
  beforeEach(async () => {
    await request(app).post("/api/users/signup").send({
      email: "test@test.com",
      password: "password",
    });
  });

  it("returns a 400 with incorrect password", async () => {
    await request(app)
      .post("/api/users/signin")
      .send({
        email: "test@test.com",
        password: "incorrect",
      })
      .expect(400);
  });

  it("returns 200 after successful signin", async () => {
    await request(app)
      .post("/api/users/signin")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(200);
  });

  it("sets a cookie after successful signin", async () => {
    const response = await request(app)
      .post("/api/users/signin")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
