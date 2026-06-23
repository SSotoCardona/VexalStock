# Etapa 1: Compilar frontend con Node
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de proyecto
COPY package*.json ./
RUN npm install

COPY . .

# Compilar para producción
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar archivos compilados
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
