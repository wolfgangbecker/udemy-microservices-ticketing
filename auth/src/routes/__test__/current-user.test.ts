import request from "supertest";
import { app } from "../../app";

it("returns 401 when not signed in", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body).toEqual({
    currentUser: null,
  });
});

it("returns the currently signed in user", async () => {
  const cookie = await global.signin();

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
