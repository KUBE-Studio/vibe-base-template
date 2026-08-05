FROM oven/bun:1-alpine AS builder

# build dependencies
RUN apk add --no-cache python3 make g++ linux-headers

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .

# better-auth is constructed at module load, so the SSR build needs *some*
# ORIGIN/AUTH_SECRET. Both are read from the environment at runtime
# ($env/dynamic/private) — these placeholders never reach the running app.
RUN ORIGIN=http://localhost AUTH_SECRET=build-time-placeholder bun run build

# ------------------------------------------------------

FROM oven/bun:1-alpine AS runner

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src/lib/server/db/migrations ./migrations
COPY --from=builder /app/server.ts ./server.ts

EXPOSE 3000

CMD ["bun", "server.ts"]
