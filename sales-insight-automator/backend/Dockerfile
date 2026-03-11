# ─── Stage 1: Builder ────────────────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first (better Docker layer caching)
COPY package*.json ./

# Install all dependencies
RUN npm ci --only=production

# ─── Stage 2: Production ─────────────────────────────────────────────────────
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy installed node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy application source code
COPY src/ ./src/
COPY package*.json ./

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose backend port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

# Start the server
CMD ["node", "src/server.js"]
