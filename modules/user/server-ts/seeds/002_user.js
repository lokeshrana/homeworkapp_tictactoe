import bcrypt from "bcryptjs";
import { returnId, truncateTables } from "@gqlapp/database-server-ts";

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, [
    "user",
    "user_profile",
    "auth_certificate",
    "auth_facebook",
    "auth_github",
    "auth_linkedin",
  ]);

  const id = await returnId(knex("user")).insert({
    username: "admin",
    email: "admin@example.com",
    password_hash: await bcrypt.hash("admin123", 12),
    role: "admin",
    is_active: true,
  });

  await returnId(
    knex("auth_certificate").insert({
      serial: "admin-123",
      user_id: id[0],
    })
  );
  for (let i = 0; i < 10; i++) {
    await returnId(knex("user")).insert({
      username: `user-${i}`,
      email: `user-${i}@example.com`,
      password_hash: await bcrypt.hash("user1234", 12),
      role: "user",
      is_active: true,
    });
  }
}
