
# Birds of Aotearoa

**Team Members:**
- Jenny Kim, ID: 3268560
- Newton Sythong, ID: 4021741

This application displays information about New Zealand (Aotearoa) bird species, including their primary names, English names, scientific names, conservation status, weights, lengths, and photos. Users can add, update, and delete bird entries through a web interface. The app is deployed using three virtual machines (VMs) managed by Vagrant and VirtualBox: a webserver for the frontend, an API VM for backend logic, and a dbserver for MySQL database storage.

## Prerequisites

Before running the application, ensure the following are installed on your host machine:

- **VirtualBox**: Version 6.1 or later (download from [https://www.virtualbox.org/](https://www.virtualbox.org/)).
- **Vagrant**: Version 2.2 or later (download from [https://www.vagrantup.com/](https://www.vagrantup.com/)).
- **Git**: For cloning the repository (download from [https://git-scm.com/](https://git-scm.com/)).
- **Approximately 2GB of free disk space**: For VM images and synced files.

No additional software is required on the host, as all dependencies (e.g., Node.js, MySQL, Nginx) are installed automatically within the VMs during provisioning.

## How to Run

Follow these steps to set up and run the application:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/kim-ji011/cosc349-assignment1.git
   cd cosc349-assignment1
   
2. **Start the VMs**:
   ```
   vagrant up
   ```
   - This command downloads the `bento/ubuntu-22.04` base box and provisions the three VMs (webserver, api, dbserver) with private IPs (192.168.56.10, 192.168.56.11, 192.168.56.12).
   - Provisioning installs MySQL, Node.js, Nginx, and preloads test data unattended.

3. **Access the Application**:
   - Open a web browser and navigate to `http://localhost:8080`.
   - The homepage displays a list of preloaded birds with conservation status colors and photos. Click on a bird to view details or use the form to update, or delete entries.
   - Click on "+" symbol on top right of page to add a new bird.

4. **Optional Troubleshooting**:
   - If the app doesn’t load (e.g., 502 Bad Gateway), check logs:
     - SSH into the API VM: `vagrant ssh api`
     - View logs: `pm2 logs bird-api`
     - Exit: `exit`
   - Re-provision if needed: `vagrant provision`.

5. **Stop the VMs**:
   ```
   vagrant halt
   ```
   To destroy and reclaim space:
   ```
   vagrant destroy -f
   ```

## Application Overview

- **Webserver VM**: Hosts Nginx on port 80, serving the UI and proxying API requests to 192.168.56.11:3000. Static images are synced from `/public/images` on the host to `/var/www/images`.
- **API VM**: Runs Node.js with Express (`server.js`) on port 3000, handling CRUD operations and querying the database.
- **dbserver VM**: Runs MySQL, storing data in `birds_db` with tables `ConservationStatus`, `Bird`, and `Photos`.


## Repository Structure

- `/`: Contains `Vagrantfile` (VM definitions), provisioning scripts (`provision_webserver.sh`, `provision_api.sh`, `provision_dbserver.sh`), app files (`server.js`, `routes.js`, `db.js`), SQL files (`db_setup.sql`, `db_populate.sql`), and `README.md`.
- `/views/`: EJS templates (e.g., `birds.ejs`).
- `/public/images/`: Bird photos synced to VMs.
- `/sql/`: Location for SQL files.
