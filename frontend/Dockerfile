# 1. Base Image
FROM node:18-alpine

# 2. Set Working Directory
WORKDIR /usr/src/app

# 3. Install pnpm
RUN npm install -g pnpm

# --- PNPM WORKSPACE SETUP ---
# pnpm'in monorepo yapısını anlayabilmesi için önce ana dosyaları kopyala
COPY pnpm-workspace.yaml ./

# Sadece frontend projesinin package.json dosyasını doğru yere kopyala
COPY frontend/package.json ./frontend/package.json

# Ana (root) package.json dosyasını kopyala
COPY package.json ./

# Tüm bağımlılıkları yükle (pnpm workspace'i tanıyacak)
RUN pnpm install

# Şimdi frontend projesinin kaynak kodunu kopyala
# Not: node_modules'ü kopyalamamak için .dockerignore dosyası önemli
COPY frontend/. ./frontend

# Next.js uygulamasını build et
RUN pnpm --filter "./frontend" build

# Çalışma dizinini frontend olarak ayarla
WORKDIR /usr/src/app/frontend

# 8. Expose Port
EXPOSE 3000

# 9. Start the Application
CMD [ "pnpm", "start" ]
