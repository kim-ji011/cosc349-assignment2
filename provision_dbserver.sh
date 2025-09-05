#!/bin/bash
apt-get update -y
apt-get install -y mysql-server
systemctl start mysql
systemctl enable mysql
mysql_secure_installation <<EOF
n
y
rootpass
rootpass
y
y
y
y
EOF
mysql -u root -prootpass <<EOF
CREATE DATABASE birds_db;
CREATE USER 'birduser'@'%' IDENTIFIED BY 'birdpass';
GRANT ALL PRIVILEGES ON birds_db.* TO 'birduser'@'%';
FLUSH PRIVILEGES;
EOF
mysql -u root -prootpass birds_db < /vagrant/db_setup.sql
echo "Database provisioned with test data."