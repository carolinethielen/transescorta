# Multi-Stage Build für TransEscorta Production
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Build the application
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Build frontend and backend
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 transescorta

# Copy built application
COPY --from=builder --chown=transescorta:nodejs /app/dist ./dist
COPY --from=builder --chown=transescorta:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=transescorta:nodejs /app/package.json ./package.json

USER transescorta

EXPOSE 3000

ENV NODE_ENV production
ENV PORT 3000
ENV HOST 0.0.0.0

CMD ["node", "dist/index.js"]