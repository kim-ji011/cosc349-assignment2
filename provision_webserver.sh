#!/bin/bash
apt-get update -y
apt-get install -y nginx
cat <<EOF > /etc/nginx/sites-available/default
server {
    listen 80 default_server;
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
    }
}
EOF
systemctl restart nginx
systemctl enable nginx
cp -r /vagrant/app/views /var/www/
cp -r /vagrant/app/public /var/www/
echo "Webserver provisioned as frontend GUI."