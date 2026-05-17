#!/bin/bash
# ============================================================
# VIMS First-Time Server Setup Script
# Run once on a fresh Ubuntu/Debian VPS as root
# Usage: bash server-init.sh
# ============================================================

set -e

REPO_URL="https://github.com/Akila-Eranda/NEW_vims.git"
APP_DIR="/opt/vims"
DOMAIN="test.hexalyte.com"
API_DOMAIN="api.test.hexalyte.com"
WS_DOMAIN="api.test.hexalyte.com"
DB_DOMAIN="db.test.hexalyte.com"

echo "======================================"
echo "  VIMS Server Initialization"
echo "======================================"

# --- Step 1: System update ---
echo "[1/7] Updating system packages..."
apt-get update -y && apt-get upgrade -y

# --- Step 2: Install Docker ---
echo "[2/7] Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | bash
    systemctl enable docker
    systemctl start docker
    echo "      Docker installed."
else
    echo "      Docker already installed: $(docker --version)"
fi

# --- Step 3: Install Docker Compose plugin ---
echo "[3/7] Checking Docker Compose..."
if ! docker compose version &> /dev/null; then
    apt-get install -y docker-compose-plugin
    echo "      Docker Compose installed."
else
    echo "      Docker Compose: $(docker compose version)"
fi

# --- Step 4: Clone repository ---
echo "[4/7] Cloning VIMS repository..."
if [ -d "$APP_DIR" ]; then
    echo "      Directory exists, pulling latest..."
    cd "$APP_DIR" && git pull origin main
else
    git clone "$REPO_URL" "$APP_DIR"
    echo "      Cloned to $APP_DIR"
fi

# --- Step 5: Create .env file ---
echo "[5/7] Setting up environment file..."
cd "$APP_DIR"
if [ ! -f ".env" ]; then
    cp .env.example .env

    # Update domain values in .env
    sed -i "s|vims.hexalyte.com|$DOMAIN|g" .env
    sed -i "s|api.vims.hexalyte.com|$API_DOMAIN|g" .env
    sed -i "s|ws.vims.hexalyte.com|$WS_DOMAIN|g" .env
    sed -i "s|db.vims.hexalyte.com|$DB_DOMAIN|g" .env
    sed -i "s|http://api.vims.hexalyte.com|http://$API_DOMAIN|g" .env
    sed -i "s|ws://ws.vims.hexalyte.com|ws://$WS_DOMAIN|g" .env
    sed -i "s|http://vims.hexalyte.com|http://$DOMAIN|g" .env

    echo "      .env created. IMPORTANT: Edit /opt/vims/.env and set your passwords!"
else
    echo "      .env already exists, skipping."
fi

# --- Step 6: Update nginx.conf for HTTP (no SSL) ---
echo "[6/7] Configuring nginx for HTTP..."
cp nginx.conf nginx.conf.backup

cat > nginx.conf << 'NGINXEOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    sendfile on;
    keepalive_timeout 65;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # Frontend
    server {
        listen 80;
        server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;

        location / {
            proxy_pass http://frontend-app:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }

    # API Backend
    server {
        listen 80;
        server_name API_DOMAIN_PLACEHOLDER;

        client_max_body_size 100M;

        location / {
            proxy_pass http://backend-app:4444;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }

    # WebSocket
    server {
        listen 80;
        server_name WS_DOMAIN_PLACEHOLDER;

        location / {
            proxy_pass http://backend-app:4444;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_read_timeout 3600s;
        }
    }

    # phpMyAdmin
    server {
        listen 80;
        server_name DB_DOMAIN_PLACEHOLDER;

        location / {
            proxy_pass http://phpmyadmin-container:80;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }

    # Default catch-all
    server {
        listen 80 default_server;
        server_name _;
        return 444;
    }
}
NGINXEOF

# Replace domain placeholders
sed -i "s|DOMAIN_PLACEHOLDER|$DOMAIN|g" nginx.conf
sed -i "s|API_DOMAIN_PLACEHOLDER|$API_DOMAIN|g" nginx.conf
sed -i "s|WS_DOMAIN_PLACEHOLDER|$WS_DOMAIN|g" nginx.conf
sed -i "s|DB_DOMAIN_PLACEHOLDER|$DB_DOMAIN|g" nginx.conf

# Also remove the SSL cert volume from docker-compose (not needed for HTTP)
sed -i '/letsencrypt/d' docker-compose.yml

echo "      nginx.conf configured for HTTP."

# --- Step 7: Start services ---
echo "[7/7] Starting VIMS services..."
docker compose up --build -d

sleep 8
echo ""
echo "======================================"
echo "  Setup Complete!"
echo "======================================"
docker compose ps
echo ""
echo "Your VIMS app is running at:"
echo "  Frontend  : http://$DOMAIN"
echo "  API       : http://$API_DOMAIN"
echo "  WebSocket : ws://$WS_DOMAIN"
echo "  DB Admin  : http://$DB_DOMAIN"
echo ""
echo "IMPORTANT: Edit /opt/vims/.env to set secure passwords!"
echo "Then run: docker compose down && docker compose up -d"
