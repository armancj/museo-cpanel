# Guía de Despliegue para Museo-CPanel en un Servidor VPS

Este documento proporciona información detallada sobre cómo desplegar la aplicación Museo-CPanel en un servidor VPS (Servidor Privado Virtual).

## Requisitos del Servidor

### Requisitos Mínimos de Hardware
- **CPU**: 2 núcleos
- **RAM**: 4GB mínimo (8GB recomendado)
- **Almacenamiento**: 20GB SSD mínimo
- **Ancho de banda**: Depende del tráfico esperado, pero se recomienda al menos 2TB/mes

### Sistema Operativo
- Ubuntu 20.04 LTS o superior (recomendado)
- Debian 11 o superior
- CentOS 8 o superior

### Software Requerido
- Node.js (versión 18.x o superior)
- npm (versión 8.x o superior) o pnpm (versión 8.x o superior, recomendado)
- Nginx (como servidor web y proxy inverso)
- PM2 (para gestionar procesos de Node.js)
- Git (para clonar el repositorio)

## Configuración del Entorno

### 1. Actualizar el Sistema
```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Instalar Node.js y npm
```bash
# Usando NVM (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Verificar instalación
node -v
npm -v
```

### 3. Instalar pnpm (opcional pero recomendado)
```bash
npm install -g pnpm
```

### 4. Instalar PM2
```bash
npm install -g pm2
```

### 5. Instalar Nginx
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 6. Instalar Git
```bash
sudo apt install git -y
```

## Despliegue de la Aplicación

### 1. Clonar el Repositorio
```bash
git clone [URL_DEL_REPOSITORIO] /var/www/museo-cpanel
cd /var/www/museo-cpanel
```

### 2. Instalar Dependencias
```bash
# Si usa pnpm
pnpm install

# Si usa npm
npm install
```

### 3. Configurar Variables de Entorno
Cree un archivo `.env` en la raíz del proyecto:
```bash
cp sample.env .env
nano .env
```

Edite el archivo `.env` con la configuración adecuada:
```
NEXT_PUBLIC_API_BASE_URL=https://api.ejemplo.com/
```

> **Importante**: La URL del API debe terminar con una barra `/`.

### 4. Construir la Aplicación
```bash
# Si usa pnpm
pnpm build

# Si usa npm
npm run build
```

### 5. Configurar PM2
Cree un archivo de configuración para PM2:
```bash
nano ecosystem.config.js
```

Añada el siguiente contenido:
```javascript
module.exports = {
  apps: [
    {
      name: "museo-cpanel",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      },
      instances: "max",
      exec_mode: "cluster"
    }
  ]
};
```

### 6. Iniciar la Aplicación con PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 7. Configurar Nginx como Proxy Inverso
Cree un archivo de configuración para Nginx:
```bash
sudo nano /etc/nginx/sites-available/museo-cpanel
```

Añada el siguiente contenido:
```nginx
server {
    listen 80;
    server_name su-dominio.com www.su-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Configuración para archivos estáticos (opcional)
    location /_next/static/ {
        alias /var/www/museo-cpanel/.next/static/;
        expires 365d;
        access_log off;
    }

    # Configuración para archivos públicos (opcional)
    location /public/ {
        alias /var/www/museo-cpanel/public/;
        expires 365d;
        access_log off;
    }
}
```

Habilite la configuración y reinicie Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/museo-cpanel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Configurar HTTPS con Let's Encrypt (recomendado)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d su-dominio.com -d www.su-dominio.com
```

## Mantenimiento y Actualización

### Actualizar la Aplicación
```bash
cd /var/www/museo-cpanel
git pull
pnpm install
pnpm build
pm2 restart museo-cpanel
```

### Monitoreo con PM2
```bash
pm2 status
pm2 logs
pm2 monit
```

### Respaldo de la Aplicación
```bash
# Respaldo de archivos
tar -czvf /backup/museo-cpanel-$(date +%Y%m%d).tar.gz /var/www/museo-cpanel
```

## Información para el Administrador del Servidor

### Puertos Requeridos
- Puerto 80 (HTTP)
- Puerto 443 (HTTPS)
- Puerto 22 (SSH)

### Configuración de Firewall (UFW)
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### Requisitos de Seguridad
- Mantener el sistema operativo y el software actualizado
- Utilizar contraseñas fuertes
- Configurar SSH para usar claves en lugar de contraseñas
- Implementar HTTPS con Let's Encrypt
- Configurar un firewall (UFW)

## Información para el Desarrollador

### Requisitos del Backend API
- La aplicación requiere un backend API accesible a través de la URL especificada en `NEXT_PUBLIC_API_BASE_URL`
- El backend debe implementar todos los endpoints definidos en el archivo `webEnvConst.ts`
- El backend debe soportar autenticación mediante tokens JWT

### Pruebas de Despliegue
Después de desplegar la aplicación, verifique:
1. Que la aplicación se carga correctamente en el navegador
2. Que puede iniciar sesión con credenciales válidas
3. Que puede acceder a todas las funcionalidades de la aplicación
4. Que no hay errores en los logs de PM2 o Nginx

## Solución de Problemas Comunes

### La aplicación no se carga
- Verifique que PM2 está ejecutando la aplicación: `pm2 status`
- Verifique los logs de PM2: `pm2 logs`
- Verifique la configuración de Nginx: `sudo nginx -t`
- Verifique que el firewall permite el tráfico: `sudo ufw status`

### Errores de conexión con el API
- Verifique que la URL del API en `.env` es correcta y termina con `/`
- Verifique que el API está accesible desde el servidor: `curl [API_URL]`
- Verifique que no hay problemas de CORS en el API

### Problemas de rendimiento
- Aumente los recursos del servidor (CPU, RAM)
- Optimice la configuración de Nginx
- Configure un CDN para archivos estáticos

## Información que Necesita Proporcionar al Administrador del Servidor

1. **URL del Repositorio Git**: Para clonar el código fuente
2. **URL del Backend API**: Para configurar la variable de entorno `NEXT_PUBLIC_API_BASE_URL`
3. **Dominio**: El dominio que se utilizará para acceder a la aplicación
4. **Requisitos Específicos**: Cualquier requisito específico de su implementación

## Información que Necesita Obtener del Administrador del Servidor

1. **Dirección IP del Servidor**: Para acceder al servidor mediante SSH
2. **Credenciales SSH**: Usuario y contraseña o clave privada para acceder al servidor
3. **Recursos Asignados**: CPU, RAM y almacenamiento disponibles
4. **Configuración de Red**: Puertos abiertos, reglas de firewall, etc.
5. **Política de Respaldos**: Frecuencia y ubicación de los respaldos
