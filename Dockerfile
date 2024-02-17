# 1. Adım: Node base image'ı kullanarak uygulamanın build işlemini yap
FROM node:14 as build-stage

WORKDIR /app

# Bağımlılıkları kopyala ve yükle
COPY package*.json ./
RUN npm install

# Tüm uygulama dosyalarını kopyala
COPY . .

# React uygulamasını build et
RUN npm run build

# 2. Adım: Nginx base image'ı kullanarak uygulamayı serve et
FROM nginx:alpine

# Build-stage'den build klasörünü kopyala
COPY --from=build-stage /app/build /usr/share/nginx/html

# Nginx konfigürasyonunu kopyala (Eğer özel bir konfigürasyonunuz varsa)
# COPY nginx.conf /etc/nginx/nginx.conf

# Nginx'in varsayılan portunu aç
EXPOSE 80

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"]
