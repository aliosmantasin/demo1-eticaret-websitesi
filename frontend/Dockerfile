# 1. Base Image
FROM node:18-alpine

# 2. Set Working Directory
WORKDIR /usr/src/app

# 3. Install pnpm
RUN npm install -g pnpm

# --- PNPM WORKSPACE SETUP ---
# pnpm'in monorepo yapısını anlayabilmesi için önce ana dosyaları kopyala
# pnpm için workspace dosyasını kopyala
COPY pnpm-workspace.yaml ./

# Bağımlılıkları yüklemeden önce package.json dosyalarını kopyala
COPY frontend/package.json ./frontend/package.json
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .npmrc ./

# Önce tüm proje kaynak kodunu kopyala
COPY . .

# pnpm için ortam değişkenini ayarla
ENV CI=true

# Tüm bağımlılıkları yükle (pnpm workspace'i tanıyacak)
RUN pnpm install

# Next.js uygulamasını build et
RUN pnpm --filter "./frontend" build

# Çalışma dizinini frontend olarak ayarla
WORKDIR /usr/src/app/frontend

# 8. Expose Port
EXPOSE 3000

# 9. Start the Application
CMD [ "pnpm", "start" ]
