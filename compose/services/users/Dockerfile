# syntax=docker/dockerfile:1

ARG NODE_VERSION=20-alpine
FROM node:${NODE_VERSION} AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm install --no-audit --no-fund

FROM base AS test
ENV NODE_ENV=test
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN npm test
RUN echo "passed" > /test-passed

FROM base AS runner
ENV NODE_ENV=production
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
# Force tests to run during build
COPY --from=test /test-passed /test-passed
ENV PORT=3001
EXPOSE 3001
CMD ["node", "server.js"]
