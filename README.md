# Birds of Aotearoa

## What the App Does

Displays New Zealand bird records (name, taxonomy, conservation status, image) and lets users create, update, and delete entries. Images are uploaded to S3 (falling back to local storage if S3 upload fails).

## Requirements (Assumed Ready)

- Node.js (v18+ recommended) on the API EC2
- Network access from API EC2 to the RDS endpoint (port 3306 open)
- S3 bucket with public read policy (or appropriate access method)
- Security group allowing inbound HTTP (port 3000 or mapped port)

## Start the Application

1. Connect to the API EC2 VM (SSH or Session Manager).
1. Navigate to the project directory:

```bash
cd cosc349-assignment2
```

1. Start the server:

```bash
npm start
```

You should see: `API running on port 3000` (or another port if `PORT` is set). The app serves pages directly—no separate frontend build step required.

Visit:

```text
http://<Frontend-EC2-Public-IP>/birds
```

##(Optional) If nginx is not running on frontend VM
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```
•  You should now see the status as
``` bash
Active: active (running)
```

## Add AWS Credentials (Learner Lab)

If using AWS Academy Learner Lab temporary credentials:

1. In the Learner Lab dashboard click **Launch AWS Academy Learner Lab**.
1. Click **AWS Details**.
1. Click **Show AWS CLI** to reveal the Access Key, Secret Key, and Session Token.
1. On the EC2 instance, create the credentials directory if it does not exist:

```bash
mkdir -p ~/.aws
```

1. Open the credentials file:

```bash
nano ~/.aws/credentials
```

1. Paste the values shown under "AWS CLI" (example structure below—do NOT copy these placeholders literally):

```ini
[default]
aws_access_key_id=AKIAEXAMPLE123456
aws_secret_access_key=exampleSecretKeyValueHere1234567890abcdEFGH
aws_session_token=IQoJb3JpZ2luX2VjEOr//////////wEaCXVzLWVhc3QtMSJHMEUCIQC5...
region=us-east-1
```

1. Save and exit (Ctrl+O, Enter, Ctrl+X).
1. (Optional) Test:

```bash
node -e "const AWS=require('aws-sdk');const s=new AWS.S3();s.listBuckets((e,d)=>console.log(e||d.Buckets.map(b=>b.Name)));"
```

These temporary credentials expire; if uploads start failing later, repeat the steps to refresh.

## Adding Birds & Images

- Use the “Create” form in the UI.
- Images are saved locally to `public/images` and (if credentials & bucket are available) uploaded to S3 with a generated key; on success the DB stores the S3 URL.

## Basic Verification

```bash
curl -I http://localhost:3000/birds
```

Expect HTTP 200.

## Common Issues

| Symptom | Check |
|---------|-------|
| Empty list | Database not populated (run SQL scripts in `sql/`) |
| Upload error | S3 credentials/role or bucket name mismatch |
| 403 on image | Bucket policy / public access settings |
| Port in use | Another node process (kill it, then restart) |

## SQL (Optional Re-init)

Only if you need to initialize or reset data (requires valid MySQL client and credentials):

```bash
mysql -h <rds-endpoint> -u birduser -p birdsdb < sql/db_setup.sql
mysql -h <rds-endpoint> -u birduser -p birdsdb < sql/db_populate.sql
```

## Project Structure (Selected)

```text
server.js          # Express entrypoint
path_router.js     # Routes + upload + DB interactions
db.js              # MySQL pool (hard-coded credentials)
views/             # EJS templates
public/            # Static assets (css, images)
sql/               # Setup & populate scripts
```

## Credits

COSC349 Assignment 2 (2025)

- Jenny Kim (3268560)
- Newton Sythong (4021741)

