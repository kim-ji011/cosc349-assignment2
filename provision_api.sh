#!/bin/bash
apt-get update -y
curl -sL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
npm install -g pm2
cd /vagrant/app
npm install
pm2 start app.js --name bird-api
pm2 startup
pm2 save
echo "API provisioned and running on port 3000."