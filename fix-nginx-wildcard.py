#!/usr/bin/env python3
import re

with open('/opt/vims/nginx.conf', 'r') as f:
    content = f.read()

# Remove all individual tenant blocks (aasa, pigeon-line-mobile, etc.)
content = re.sub(r'\n    # Tenant:.*?(?=\n    # Default catch-all)', '', content, flags=re.DOTALL)

# Remove HTTP redirect for tenant subdomains if already there
content = re.sub(r'\n    # Redirect HTTP to HTTPS for tenant subdomains.*?(?=\n    #|\n})', '', content, flags=re.DOTALL)

wildcard_blocks = '''
    # Redirect HTTP -> HTTPS for ALL *.app.hexalyte.com tenant subdomains
    server {
        listen 80;
        server_name ~^(?<tenant>[^.]+)\\.app\\.hexalyte\\.com$;
        return 301 https://$host$request_uri;
    }

    # Wildcard HTTPS for ALL *.app.hexalyte.com tenant subdomains
    server {
        listen 443 ssl;
        server_name ~^(?<tenant>[^.]+)\\.app\\.hexalyte\\.com$;

        ssl_certificate /etc/letsencrypt/live/app.hexalyte.com-0001/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/app.hexalyte.com-0001/privkey.pem;
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

content = content.replace('    # Default catch-all', wildcard_blocks + '    # Default catch-all')

with open('/opt/vims/nginx.conf', 'w') as f:
    f.write(content)

print('nginx.conf updated with wildcard tenant rule')
