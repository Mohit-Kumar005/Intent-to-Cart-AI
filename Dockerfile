# Multi-stage build for Intent-to-Cart AI
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ .
COPY --from=frontend-build /app/frontend/dist ./public
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1
ENV NODE_ENV=production
CMD ["node", "src/server.js"]
