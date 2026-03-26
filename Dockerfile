# ==========================================
# 🏗️ ETAPA 1: Build (Construcción)
# ==========================================
FROM node:22-alpine AS build
WORKDIR /app

# Copiamos archivos de configuración
COPY package.json yarn.lock* ./

# Instalamos dependencias (con timeout alto por seguridad de red)
RUN yarn install --frozen-lockfile --network-timeout 1000000

# Copiamos el código fuente
COPY . .

# Variables de entorno para el build de React/Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Generamos la carpeta /dist
RUN yarn build

# ==========================================
# 🚀 ETAPA 2: Production (Nginx)
# ==========================================
FROM nginx:alpine AS prod

# Limpieza y copiado de archivos estáticos desde la etapa de 'build'
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración de Nginx para SPAs
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ==========================================
# 🛠️ ETAPA 3: Development (Vite Dev Server)
# ==========================================
FROM node:22-alpine AS dev
WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn install --network-timeout 1000000
COPY . .
EXPOSE 5173
CMD ["yarn", "dev", "--host", "0.0.0.0"]