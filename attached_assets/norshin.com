server {
    #listen 443 ssl;
    server_name norshin.com www.norshin.com;
    
    # SSL certificates (already configured by Certbot)
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
	proxy_read_timeout 300;
        client_max_body_size 20M;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/norshin.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/norshin.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


}

server {
    if ($host = www.norshin.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = norshin.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name norshin.com www.norshin.com;
    return 404; # managed by Certbot




}
