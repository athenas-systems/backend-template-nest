import { z } from "zod";

export const environmentSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
  CORS_ORIGIN: z
    .string()
    .default("http://localhost:5173")
    .refine(
      (value) =>
        value === "*" ||
        value
          .split(",")
          .every((origin) => z.url().safeParse(origin.trim()).success),
      "CORS_ORIGIN must be * or a comma-separated list of valid origins",
    ),
});

export function validateEnvironment(environment: Record<string, unknown>) {
  return { ...environment, ...environmentSchema.parse(environment) };
}
