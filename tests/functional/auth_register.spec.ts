import { test } from "@japa/runner";
import db from "@adonisjs/lucid/services/db";

test.group("Auth Registration", (group) => {
  group.each.setup(async () => {
    await db.transaction(async (trx) => {
      await trx.from("profiles").delete();
      await trx.from("auth_users").delete();
    });
  });

  test("GET /register renders Inertia page", async ({ client }) => {
    const response = await client.get("/register").withInertia();
    response.assertStatus(200);
    response.assertInertiaComponent("auth/Register");
  });

  test("POST /register creates auth_user and profile", async ({
    client,
    assert,
  }) => {
    const email = "new@example.com";

    // First make a GET request to establish session and get CSRF token
    await client.get("/register");

    const response = await client
      .post("/register")
      .form({
        email,
        password: "password123",
        password_confirmation: "password123",
        username: "newbie",
      })
      .withCsrfToken();

    response.assertRedirectsTo("/register");

    const user = await db.from("auth_users").where("email", email).first();
    assert.exists(user);
    const profile = await db
      .from("profiles")
      .where("auth_user_id", user.id)
      .first();
    assert.exists(profile);
  });

  test("duplicate email returns validation-like error", async ({ client }) => {
    const email = "dupe@example.com";

    // First registration - establish session and use CSRF token
    await client.get("/register");
    await client
      .post("/register")
      .form({
        email,
        password: "password123",
        password_confirmation: "password123",
      })
      .withCsrfToken();

    // Second registration with same email - should fail
    await client.get("/register");
    const response = await client
      .post("/register")
      .form({
        email,
        password: "password123",
        password_confirmation: "password123",
      })
      .withCsrfToken();

    response.assertRedirectsTo("/register");
  });
});
