#!/bin/bash
apt-get update -y
apt-get install -y mysql-server
systemctl start mysql
systemctl enable mysql

sed -i "s/^bind-address\s*=.*/bind-address = 0.0.0.0/" /etc/mysql/mysql.conf.d/mysqld.cnf
systemctl restart mysql

# Secure installation with password (non-interactive)
mysql <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY 'rootpass';
FLUSH PRIVILEGES;
EOF
mysql -u root -prootpass <<EOF
CREATE DATABASE birds_db;
CREATE USER 'birduser'@'%' IDENTIFIED WITH 'mysql_native_password' BY 'birdpass';
GRANT ALL PRIVILEGES ON birds_db.* TO 'birduser'@'%';
FLUSH PRIVILEGES;
EOF
mysql -u root -prootpass birds_db < /vagrant/sql/db_setup.sql
mysql -u root -prootpass birds_db < /vagrant/sql/db_populate.sql

echo "Database provisioned with test data."