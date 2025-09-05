# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "bento/ubuntu-22.04"
  config.vm.synced_folder ".", "/vagrant", owner: "vagrant", group: "vagrant"
  config.vm.synced_folder "./app/public/images", "/var/www/images", type: "virtualbox"

  # Webserver VM (Frontend)
  config.vm.define "webserver" do |webserver|
    webserver.vm.hostname = "webserver"
    webserver.vm.network "private_network", ip: "192.168.56.10"
    webserver.vm.network "forwarded_port", guest: 80, host: 8080  # Forward port 80 to localhost:8080
    webserver.vm.provider "virtualbox" do |vb|
      vb.memory = 512
      vb.cpus = 1
    end
    webserver.vm.provision "shell", path: "provision_webserver.sh"
  end

  # API VM
  config.vm.define "api" do |api|
    api.vm.hostname = "api"
    api.vm.network "private_network", ip: "192.168.56.11"
    api.vm.network "forwarded_port", guest: 3000, host: 3000  # Forward port 3000 to localhost:3000 (for debugging)
    api.vm.provider "virtualbox" do |vb|
      vb.memory = 1024
      vb.cpus = 1
    end
    api.vm.provision "shell", path: "provision_api.sh"
  end

  # Database VM (Backend)
  config.vm.define "dbserver" do |dbserver|
    dbserver.vm.hostname = "dbserver"
    dbserver.vm.network "private_network", ip: "192.168.56.12"
    dbserver.vm.provider "virtualbox" do |vb|
      vb.memory = 1024
      vb.cpus = 1
    end
    dbserver.vm.provision "shell", path: "provision_dbserver.sh"
  end
end