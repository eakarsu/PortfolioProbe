# /etc/nginx/sites-available/api.orderlybite.com
server {
    server_name api.orderlybite.com;

    location ~ /\.well-known/acme-challenge/ {
        allow all;
        root /var/www/certbot-api;
    }


    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/orderlybite.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/orderlybite.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

    # Proxy all requests to your FastAPI backend
    location / {

        # Handle OPTIONS preflight directly in Nginx (or pass to FastAPI if preferred)
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' "$http_origin" always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always; # Or '*'
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain charset=UTF-8';
        add_header 'Content-Length' 0;
        return 204;
    }

        proxy_pass http://localhost:5003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 300s;
        client_max_body_size 20M;
    }

}

# HTTPS block will be added by Certbot


server {
    if ($host = api.orderlybite.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    listen [::]:80;
    server_name api.orderlybite.com;
    return 404; # managed by Certbot


}
