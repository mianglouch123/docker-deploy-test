# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# NUEVO: Instalamos gettext (para el comando envsubst)
RUN apk add --no-cache gettext

# NUEVO: Copiamos la plantilla desde el Stage 1 a la carpeta de Nginx
COPY --from=builder /app/src/assets/config.template.json /usr/share/nginx/html/assets/config.template.json


COPY entrypoint.sh /docker-entrypoint.d/40-envsubst-config.sh
RUN chmod +x /docker-entrypoint.d/40-envsubst-config.sh

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/angular-learning/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]