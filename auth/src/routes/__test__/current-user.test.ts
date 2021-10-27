import request from "supertest";
import { app } from "../../app";

it("returns 401 when not signed in", async () => {
  await request(app).get("/api/users/currentuser").send().expect(401);
});

it("returns the currently signed in user", async () => {
  const signupResponse = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const cookie = signupResponse.get("Set-Cookie");

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body).toEqual({
    currentUser: expect.objectContaining({
      id: expect.any(String),
      email: "test@test.com",
    }),
  });
});
