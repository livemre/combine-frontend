# Nginx resmi base image'ını kullan
FROM nginx:alpine

# React uygulamanızın build klasörünü Nginx'in HTML dizinine kopyala
COPY /home/ubuntu/frontend/build /usr/share/nginx/html

# Nginx'in varsayılan portunu aç
EXPOSE 80

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"]
