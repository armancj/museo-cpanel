#!/bin/bash
set -e

# Variables you should adjust
APP_DIR="/var/www/museo-cpanel"       # Path where your frontend repo is (and where this script is)
API_BASE_URL="http://10.0.0.5:5000/api"   # Backend API URL
DOMAIN_OR_IP="10.0.0.4"                # IP or domain for Nginx

echo "---- Updating system ----"
sudo apt update && sudo apt upgrade -y

# Check if Node.js is installed
if command -v node >/dev/null 2>&1; then
  echo "Node.js is already installed, version: $(node -v)"
else
  echo "Node.js is not installed, installing Node.js 20.x..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# Check if pnpm is installed
if command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is already installed, version: $(pnpm -v)"
else
  echo "pnpm is not installed, installing pnpm globally..."
  sudo npm install -g pnpm
fi

# Install pm2 if not installed
if command -v pm2 >/dev/null 2>&1; then
  echo "pm2 is already installed, version: $(pm2 -v)"
else
  echo "pm2 is not installed, installing pm2 globally..."
  sudo npm install -g pm2
fi

echo "---- Updating code ----"
cd "$APP_DIR"
git pull

echo "---- Creating .env.production file ----"
cat > .env <<EOF
NEXT_PUBLIC_API_BASE_URL=$API_BASE_URL
EOF

echo "---- Installing dependencies and building with pnpm ----"
pnpm install
pnpm run build

echo "---- Configuring PM2 ----"
if pm2 list | grep -q frontend-next; then
    echo "Process frontend-next already exists, restarting..."
    pm2 delete frontend-next
    pm2 start npm --name frontend-next -- start
else
    echo "Starting new process frontend-next..."
    pm2 start npm --name frontend-next -- start
fi

pm2 save
# shellcheck disable=SC2046
# shellcheck disable=SC2086
pm2 startup systemd -u $(whoami) --hp $(eval echo ~$USER)

echo "---- Configuring Nginx ----"
NGINX_CONF="/etc/nginx/sites-available/museo-cpanel"

sudo tee $NGINX_CONF > /dev/null <<EOL
server {
    listen 80;
    server_name $DOMAIN_OR_IP;

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

echo "---- Checking Nginx configuration ----"
sudo nginx -t

echo "---- Restarting Nginx ----"
sudo systemctl reload nginx

echo "---- Deployment completed! ----"
echo "Frontend running at http://$DOMAIN_OR_IP"
