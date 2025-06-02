# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/client/dist ./client/dist

# Copy other necessary files
COPY --chown=nextjs:nodejs ./server ./server
COPY --chown=nextjs:nodejs ./shared ./shared

# Switch to non-root user
USER nextjs

# Expose port (default to 5000, can be overridden)
EXPOSE 5000

# Set environment variable for port
ENV PORT=5000
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]