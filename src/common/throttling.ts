import { Throttle } from "@nestjs/throttler";

export const AUTH_THROTTLE_OPTIONS = { limit: 5, ttl: 60_000 } as const;

export function AuthThrottle(): MethodDecorator & ClassDecorator {
  return Throttle({ default: AUTH_THROTTLE_OPTIONS });
}
