FROM node:23-alpine AS build

# setting up MatchAnalyzer
ARG environment
RUN echo "environment: $environment"
RUN apk add --no-cache g++ make python3
# set work directory on Docker
WORKDIR /app

# Install dependencies
# RUN npm install && npm run build
# CMD [ "npm", "run", "build" ]
# RUN mkdir -p /usr/share/nginx/html && chown -R node:node /usr/share/nginx/html
# RUN if [ -d dist ]; then cp -r dist /usr/share/nginx/html; else echo "no existe"; fi

# Copia los archivos de tu proyecto
COPY . .

# Instala las dependencias
RUN npm install

# Construye el proyecto
RUN npm run build

# Al final, solo necesitamos los archivos estáticos de Vue.js
# Estos se copiarán al directorio de trabajo que Caddy usará más tarde
FROM nginx:alpine

# Copia los archivos construidos al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80