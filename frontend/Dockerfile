# Etapa 1: Buildar a aplicação Angular
FROM node:20-alpine as build-stage

WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Remove node_modules se existir e instala dependências clean
RUN rm -rf node_modules package-lock.json && npm install

# Copia o restante do código fonte
COPY . .

# Remove node_modules novamente e reinstala para garantir compatibilidade com Linux
RUN rm -rf node_modules && npm ci

# Compila a aplicação Angular para produção
RUN npm run build:prod

# Verifica se o build foi criado corretamente
RUN ls -la /app/dist/event-manager-frontend/browser/

# Etapa 2: Servir a aplicação com Nginx
FROM nginx:alpine as production-stage

# Remove configuração padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia a configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos de build do Angular para o diretório do Nginx
COPY --from=build-stage /app/dist/event-manager-frontend/browser /usr/share/nginx/html

# Verifica se os arquivos foram copiados corretamente
RUN ls -la /usr/share/nginx/html/

# Cria um script de inicialização
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'echo "Starting nginx..."' >> /docker-entrypoint.sh && \
    echo 'echo "Files in /usr/share/nginx/html:"' >> /docker-entrypoint.sh && \
    echo 'ls -la /usr/share/nginx/html/' >> /docker-entrypoint.sh && \
    echo 'nginx -t' >> /docker-entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

EXPOSE 80

# Usar o script de inicialização
CMD ["/docker-entrypoint.sh"]
