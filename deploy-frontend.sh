#!/bin/bash
set -e

# Variables que debes ajustar
APP_DIR="/var/www/museo-cpanel"       # Ruta donde está tu repo frontend (y donde está este script)
API_BASE_URL="http://10.0.0.5:5000"   # URL backend API
DOMAIN_OR_IP="10.0.0.4"                # IP o dominio para Nginx

echo "---- Actualizando sistema ----"
sudo apt update && sudo apt upgrade -y

echo "---- Instalando Node.js (v18) y PM2 ----"
# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar pm2 globalmente
sudo npm install -g pm2

echo "---- Actualizando código ----"
cd "$APP_DIR"
git pull

echo "---- Instalando dependencias y haciendo build ----"
npm install
npm run build

echo "---- Creando archivo .env.production ----"
cat > .env.production <<EOF
NEXT_PUBLIC_API_BASE_URL=$API_BASE_URL
EOF

echo "---- Configurando PM2 ----"
pm2 start npm --name frontend-next -- start
pm2 save
pm2 startup systemd -u $(whoami) --hp $(eval echo ~$USER)

echo "---- Configurando Nginx ----"
NGINX_CONF="/etc/nginx/sites-available/museo-cpanel"

sudo tee $NGINX_CONF > /dev/null <<EOL
server {
    listen 80;
    server_name $DOMAIN_OR_IP;

    location = / {
        return 302 /landing;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
EOL

sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/museo-cpanel

echo "---- Verificando configuración Nginx ----"
sudo nginx -t

echo "---- Reiniciando Nginx ----"
sudo systemctl reload nginx

echo "---- Despliegue completado! ----"
echo "Frontend corriendo en http://$DOMAIN_OR_IP"
