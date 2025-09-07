#!/bin/bash
apt-get update -y
curl -sL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
apt-get install -y mysql-client
npm install -g pm2

cd /vagrant
npm install

# Stop any previous instance
pm2 delete bird-api || true

# Start the API server with PM2
pm2 start /vagrant/server.js --name bird-api

# Save PM2 process list and configure startup
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u vagrant --hp /home/vagrant

echo "API provisioned and running on port 3000."