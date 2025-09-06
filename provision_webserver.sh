#!/bin/bash
apt-get update -y
apt-get install -y nginx
cat <<'EOF' > /etc/nginx/sites-available/default
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    root /var/www;
    index index.html index.htm;
    location /images/ {
        autoindex on;
    }
    location / {
        proxy_pass http://192.168.56.11:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF
cp -r /vagrant/views /var/www/
cp -r /vagrant/public /var/www/

systemctl restart nginx
systemctl enable nginx

echo "Webserver provisioned as frontend GUI."