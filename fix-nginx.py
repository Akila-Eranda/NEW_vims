#!/usr/bin/env python3
import re

with open('/opt/vims/nginx.conf', 'r') as f:
    content = f.read()

# Remove any broken tenant blocks
content = re.sub(r'\n    # Tenant:.*?(?=\n    # Default catch-all)', '', content, flags=re.DOTALL)

tenant_blocks = '''
    # Tenant: aasa.app.hexalyte.com
    server {
        listen 443 ssl;
        server_name aasa.app.hexalyte.com;
        ssl_certificate /etc/letsencrypt/live/aasa.app.hexalyte.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/aasa.app.hexalyte.com/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        location / {
            set $upstream http://hexalyte_web:3000;
            proxy_pass $upstream;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }

    # Tenant: pigeon-line-mobile.app.hexalyte.com
    server {
        listen 443 ssl;
        server_name pigeon-line-mobile.app.hexalyte.com;
        ssl_certificate /etc/letsencrypt/live/pigeon-line-mobile.app.hexalyte.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/pigeon-line-mobile.app.hexalyte.com/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        location / {
            set $upstream http://hexalyte_web:3000;
            proxy_pass $upstream;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }

'''

content = content.replace('    # Default catch-all', tenant_blocks + '    # Default catch-all')

with open('/opt/vims/nginx.conf', 'w') as f:
    f.write(content)

print('nginx.conf updated successfully')
