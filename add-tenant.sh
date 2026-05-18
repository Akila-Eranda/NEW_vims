#!/bin/bash
# Usage: ./add-tenant.sh pigeon-line-mobile
# Adds a new tenant subdomain: <slug>.app.hexalyte.com

SLUG=$1
DOMAIN="${SLUG}.app.hexalyte.com"
CONF="/opt/vims/nginx-ssl.conf"

if [ -z "$SLUG" ]; then
  echo "Usage: $0 <tenant-slug>"
  exit 1
fi

# Check if already configured
if grep -q "$DOMAIN" "$CONF"; then
  echo "[INFO] $DOMAIN already in nginx config. Skipping cert + config."
else
  echo "[1/3] Getting SSL cert for $DOMAIN..."
  docker stop nginx-proxy
  certbot certonly --standalone -d "$DOMAIN" --non-interactive --agree-tos -m admin@hexalyte.com
  docker start nginx-proxy

  if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "[ERROR] Cert not found. DNS may not be pointing to this server."
    exit 1
  fi

  echo "[2/3] Adding nginx server block for $DOMAIN..."
  # Insert before the default catch-all block
  sed -i "/# Default catch-all/i\\
    # Tenant: $DOMAIN\\
    server {\\
        listen 443 ssl;\\
        server_name $DOMAIN;\\
\\
        ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;\\
        ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;\\
        ssl_protocols TLSv1.2 TLSv1.3;\\
        ssl_ciphers HIGH:!aNULL:!MD5;\\
\\
        location / {\\
            set \$upstream http://hexalyte_web:3000;\\
            proxy_pass \$upstream;\\
            proxy_set_header Host \$host;\\
            proxy_set_header X-Real-IP \$remote_addr;\\
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;\\
            proxy_set_header X-Forwarded-Proto \$scheme;\\
            proxy_http_version 1.1;\\
            proxy_set_header Upgrade \$http_upgrade;\\
            proxy_set_header Connection \"upgrade\";\\
        }\\
    }\\
" "$CONF"
fi

echo "[3/3] Reloading nginx..."
docker exec nginx-proxy nginx -t && docker exec nginx-proxy nginx -s reload
echo "[DONE] https://$DOMAIN is now live!"
