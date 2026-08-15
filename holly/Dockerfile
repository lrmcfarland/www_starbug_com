# Stage 1: Build the React application
FROM node:24.16.0-alpine AS build
WORKDIR /app

# Install dependencies using cache optimization
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve the production assets with Nginx
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf.template
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE "${HOLLY_PORT:-3000}"
ENTRYPOINT ["/entrypoint.sh"]
CMD []
