#!/bin/bash
apt-get update -y
curl -sL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
npm install -g pm2
cd /vagrant/app
npm install
pm2 start /vagrant/server.js --name bird-api
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u vagrant --hp /vagrant
pm2 save
echo "API provisioned and running on port 3000."