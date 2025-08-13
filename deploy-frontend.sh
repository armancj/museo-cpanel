#!/bin/bash
set -e

# Variables que debes ajustar
APP_DIR="/var/www/museo-cpanel"       # Ruta donde está tu repo frontend (y donde está este script)
API_BASE_URL="http://10.0.0.5:5000"   # URL backend API
DOMAIN_OR_IP="10.0.0.4"                # IP o dominio para Nginx

echo "---- Actualizando sistema ----"
sudo apt update && sudo apt upgrade -y

# Verificar si Node.js está instalado
if command -v node >/dev/null 2>&1; then
  echo "Node.js ya está instalado, versión: $(node -v)"
else
  echo "Node.js no está instalado, instalando Node.js 20.x..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# Verificar si pnpm está instalado
if command -v pnpm >/dev/null 2>&1; then
  echo "pnpm ya está instalado, versión: $(pnpm -v)"
else
  echo "pnpm no está instalado, instalando pnpm globalmente..."
  sudo npm install -g pnpm
fi

# Instalar pm2 si no está
if command -v pm2 >/dev/null 2>&1; then
  echo "pm2 ya está instalado, versión: $(pm2 -v)"
else
  echo "pm2 no está instalado, instalando pm2 globalmente..."
  sudo npm install -g pm2
fi

echo "---- Actualizando código ----"
cd "$APP_DIR"
git pull

echo "---- Instalando dependencias y haciendo build con pnpm ----"
pnpm install
pnpm run build

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
