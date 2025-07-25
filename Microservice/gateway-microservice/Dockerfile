# Build stage
FROM node:22.14.0-alpine3.21 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:22.14.0-alpine3.21 AS production

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Create non-root user and set proper ownership
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create logs directory and set proper permissions
RUN mkdir -p logs && chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Set production environment
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 8080

CMD ["npm", "run", "start"]
