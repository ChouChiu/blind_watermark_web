FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ARG BACKEND_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=""
ENV BACKEND_URL=${BACKEND_URL}

RUN bun run build

FROM node:20-slim AS runner

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
