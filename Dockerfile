# Multi-stage build for Vite React app

# 1) Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Accept build args
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Install deps
COPY package*.json ./
RUN npm ci --no-cache

# Copy source
COPY . .

# Create .env file with build arg
RUN echo "VITE_API_BASE_URL=$VITE_API_BASE_URL" > .env

# Build the app
RUN npm run build

# 2) Runtime stage (nginx serving static files)
FROM nginx:1.27-alpine AS runner

# Copy nginx config for SPA routing (history API fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Basic healthcheck
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
