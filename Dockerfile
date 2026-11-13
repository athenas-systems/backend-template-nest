# ==========================================
# Stage 1: Install dependencies
# ==========================================
FROM oven/bun:1.4.4-slim AS installer
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install all dependencies (including devDependencies needed for build)
RUN bun install --frozen-lockfile

# ==========================================
# Stage 2: Build the application
# ==========================================
FROM oven/bun:1.4.4-slim AS builder
WORKDIR /app

# Copy node_modules from installer stage
COPY --from=installer /app/node_modules ./node_modules
COPY . .

# Build the NestJS application (outputs to /app/dist by default)
RUN bun run build

# Prune devDependencies, keeping only production dependencies
RUN bun install --frozen-lockfile --production

# ==========================================
# Stage 3: Production runtime image
# ==========================================
FROM oven/bun:1.4.4-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user for security best practices
RUN useradd --create-home --shell /bin/bash appuser
USER appuser

# Copy production node_modules, compiled dist, and package.json
COPY --from=builder --chown=appuser:appuser /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appuser /app/dist ./dist
COPY --from=builder --chown=appuser:appuser /app/package.json ./package.json

EXPOSE 3000

# Run the compiled NestJS main file using Bun
CMD ["bun", "run", "dist/main.js"]