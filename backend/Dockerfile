# 1. Base Image
FROM node:18

# 2. Set Working Directory
WORKDIR /usr/src/app

# 3. Install pnpm
RUN npm install -g pnpm

# --- PNPM WORKSPACE SETUP ---
# pnpm'in monorepo yapısını anlayabilmesi için önce ana dosyaları kopyala
COPY pnpm-workspace.yaml ./

# Sadece backend projesinin package.json dosyasını doğru yere kopyala
COPY backend/package.json ./backend/package.json

# Ana (root) package.json dosyasını kopyala
COPY package.json ./

# Tüm bağımlılıkları yükle (pnpm workspace'i tanıyacak)
RUN pnpm install

# Şimdi backend projesinin kaynak kodunu kopyala
COPY backend/. ./backend

# Prisma Client'ı oluştur (artık node_modules doğru yapıda)
RUN pnpm --filter ecom-backend exec prisma generate

# TypeScript kodunu build et
RUN pnpm --filter "./backend" build

# Çalışma dizinini backend olarak ayarla
WORKDIR /usr/src/app/backend

# 9. Expose Port
EXPOSE 5000

# 10. Start the Application
CMD [ "pnpm", "start" ]
