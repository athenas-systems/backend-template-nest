import type { INestApplication } from "@nestjs/common";
import request from "supertest";

interface AuthUserOptions {
  email?: string;
  password?: string;
  name?: string;
}

interface AuthUser {
  id: number;
  email: string;
  name: string;
  accessToken: string;
}

export async function createAuthenticatedUser(
  app: INestApplication,
  options: AuthUserOptions = {},
): Promise<AuthUser> {
  const user = {
    email: options.email ?? `user-${crypto.randomUUID()}@example.test`,
    password: options.password ?? "Test-password-123!",
    name: options.name ?? "Test User",
  };

  const registration = await request(app.getHttpServer())
    .post("/auth/register")
    .send(user)
    .expect(201);
  const login = await request(app.getHttpServer())
    .post("/auth/login")
    .send({ email: user.email, password: user.password })
    .expect(200);

  const registeredUser = registration.body as Pick<
    AuthUser,
    "id" | "email" | "name"
  >;
  const credentials = login.body as Pick<AuthUser, "accessToken">;
  return { ...registeredUser, ...credentials };
}
