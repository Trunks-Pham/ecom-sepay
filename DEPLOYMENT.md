# 🚀 EcomSePay Production Deployment Guide

## Prerequisites

- Ubuntu 20.04 or higher
- Domain name
- SePay API credentials
- Git access to repository

## Step 1: Server Setup (15-20 mins)

### 1.1 Run Setup Script

```bash
#!/bin/bash
# Clone and run setup
cd ~
git clone <your-repo-url> setup-temp
cd setup-temp
sudo chmod +x setup-production.sh
sudo ./setup-production.sh
```

This script will:
- Update system packages
- Install Node.js 20, MongoDB, Nginx, PM2, Certbot
- Create application directory
- Install dependencies
- Build application
- Create directory structure

### 1.2 Manual Configuration

**Edit Environment File:**
```bash
sudo nano /var/www/ecom-sepay/.env.local
```

Update with your values:
- SEPAY_CLIENT_ID
- SEPAY_API_KEY
- SEPAY_WEBHOOK_SECRET
- JWT_SECRET (keep secure)

**Configure Nginx Domain:**
```bash
sudo nano /etc/nginx/sites-available/ecom-sepay
```

Replace `your-domain.com` with your actual domain.

## Step 2: SSL Certificate Setup

```bash
# Get free SSL from Let's Encrypt
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com

# Auto-renew
sudo systemctl enable certbot.timer
```

Update Nginx config with certificate paths:
```bash
sudo nano /etc/nginx/sites-available/ecom-sepay

# Update these lines:
ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
```

## Step 3: Database Setup

```bash
# Check MongoDB status
sudo systemctl status mongod

# Allow remote access (if needed) - ONLY for private networks
# sudo nano /etc/mongod.conf
# Change: bindIp: 127.0.0.1 to bindIp: 0.0.0.0

# Create database backup
sudo mkdir -p /var/backups/mongodb
sudo mongodump --out /var/backups/mongodb/$(date +%Y%m%d)
```

## Step 4: Application Deployment

### 4.1 Deploy Code

```bash
cd /var/www/ecom-sepay

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Build application
npm run build

# Seed initial data (optional)
npm run seed
```

### 4.2 Start/Restart Application

```bash
# Start with PM2
pm2 start npm --name "ecom-sepay" -- start

# or reload if already running
pm2 reload ecom-sepay

# Make PM2 startup persistent
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs ecom-sepay
```

### 4.3 Start Nginx

```bash
# Test configuration
sudo nginx -t

# Start/Restart
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx
```

## Step 5: Firewall Setup

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check rules
sudo ufw status
```

## Step 6: Post-Deployment

### 6.1 Verify Setup

```bash
# Check if app is running
curl -I https://your-domain.com

# Check API
curl https://your-domain.com/api/auth/login

# Monitor app
pm2 monit

# View logs
pm2 logs ecom-sepay
tail -f /var/log/nginx/ecom-sepay-access.log
```

### 6.2 Setup Backups

```bash
# Create backup script
cat > /usr/local/bin/backup-ecom.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/ecom-sepay"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)

# Backup MongoDB
mongodump --out $BACKUP_DIR/mongodb_$DATE

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/ecom-sepay/public/uploads

# Keep only last 7 days
find $BACKUP_DIR -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

# Make executable
sudo chmod +x /usr/local/bin/backup-ecom.sh

# Setup cron job (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-ecom.sh >> /var/log/ecom-sepay-backup.log 2>&1
```

### 6.3 Setup Monitoring

```bash
# Install Node.js monitoring
npm install -g pm2-logrotate
pm2 install pm2-logrotate

# Setup email alerts (optional)
pm2 install pm2-auto-pull
pm2 install pm2-restart-on-code-change
```

## Useful Commands

### Application Management
```bash
# Check status
pm2 status
pm2 list

# View logs
pm2 logs ecom-sepay [--lines 100] [--err]
pm2 flush  # Clear all logs

# Restart/Stop/Delete
pm2 restart ecom-sepay
pm2 stop ecom-sepay
pm2 delete ecom-sepay

# Save current state
pm2 save
pm2 unstartup
pm2 startup
```

### Nginx Management
```bash
# Check configuration
sudo nginx -t

# Reload (don't disconnect users)
sudo systemctl reload nginx

# Restart (may disconnect users)
sudo systemctl restart nginx

# View logs
sudo tail -f /var/log/nginx/ecom-sepay-access.log
sudo tail -f /var/log/nginx/ecom-sepay-error.log
```

### Database Management
```bash
# Connect to MongoDB
mongosh ecom-sepay

# Common commands in MongoDB shell:
db.users.countDocuments()        # Count users
db.products.countDocuments()     # Count products
db.orders.countDocuments()       # Count orders
db.users.findOne()               # Get first user
db.users.find({}).pretty()       # Display all users formatted
db.users.deleteOne({email: "..."})  # Delete user

# Backup
mongodump --out /var/backups/ecom-sepay-backup

# Restore
mongorestore /var/backups/ecom-sepay-backup
```

### System Monitoring
```bash
# CPU, Memory, Processes
htop

# Disk usage
df -h
du -sh /var/www/ecom-sepay

# MongoDB size
du -sh /var/lib/mongodb

# Network connections
netstat -tlnp
ss -tlnp

# Process details
ps aux | grep node
ps aux | grep nginx
```

## Troubleshooting

### App not starting
```bash
# Check logs
pm2 logs ecom-sepay --err

# Check if port 3000 is in use
sudo lsof -i :3000
sudo kill -9 <PID>

# Manually run to see errors
npm start
```

### Nginx 502 Bad Gateway
```bash
# Check if app is running
pm2 status

# Check if app is listening on port 3000
curl http://localhost:3000

# Check Nginx error log
sudo tail -f /var/log/nginx/ecom-sepay-error.log

# Restart Nginx
sudo systemctl restart nginx

# Check app logs
pm2 logs ecom-sepay
```

### MongoDB connection errors
```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check if listening
sudo netstat -tlnp | grep mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Out of disk space
```bash
# Find large files
find /var -size +1G -type f

# Clean up logs
pm2 flush

# Remove old backups
rm -rf /var/backups/ecom-sepay/$(date -d '30 days ago' +%Y%m%d)*

# Clean npm cache
npm cache clean --force
```

### SSL certificate issues
```bash
# Check certificate expiry
sudo certbot certificates

# Renew manually
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run

# Check cert in Nginx
sudo head -20 /etc/letsencrypt/live/your-domain.com/fullchain.pem
```

## Performance Optimization

### 1. Enable Gzip in Nginx
Already enabled in provided nginx.conf

### 2. Optimize MongoDB
```bash
# Create indexes for faster queries
mongosh ecom-sepay << 'EOF'
db.products.createIndex({slug: 1})
db.products.createIndex({category: 1})
db.users.createIndex({email: 1})
db.orders.createIndex({userId: 1})
db.orders.createIndex({orderNumber: 1})
EOF
```

### 3. Setup PM2 Cluster Mode
```bash
# Already configured in ecosystem.config.js
# Uses max CPUs available

# Adjust instances
pm2 scale ecom-sepay 4  # Use 4 instances
```

### 4. Database Maintenance
```bash
# Run MongoDB profiling
mongosh ecom-sepay << 'EOF'
db.setProfilingLevel(1, { slowms: 100 })  # Log queries > 100ms
db.system.profile.find().pretty()         # View slow queries
EOF
```

## Security Hardening

### 1. Fail2Ban (Brute Force Protection)
```bash
sudo apt-get install -y fail2ban

# Create jail config
sudo tee /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

[nginx-http-auth]
enabled = true

[nginx-noscript]
enabled = true
EOF

sudo systemctl restart fail2ban
```

### 2. Update Regularly
```bash
# Security updates
sudo apt-get install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 3. Secure SSH
```bash
sudo nano /etc/ssh/sshd_config

# Recommended changes:
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
X11Forwarding no
```

## Monitoring & Alerting

### 1. Setup PM2 Monitoring
```bash
# Install plugins
pm2 install pm2-logrotate
pm2 install pm2-auto-pull

# Monitor dashboard (web)
pm2 web  # Visit http://localhost:9615
```

### 2. Setup Alert on Errors
```bash
# Install email alerts
npm install pm2-email -g 

# Configure
pm2 email [your-email@example.com]
```

## Scheduled Tasks

### Database Backups
```bash
# Create backup script
sudo crontab -e

# Add:
0 2 * * * /usr/local/bin/backup-ecom.sh
0 3 * * 0 /usr/local/bin/backup-ecom.sh --upload-s3  # Weekly S3 backup
```

### Code Updates
```bash
# Auto-pull updates (use with caution)
pm2 install pm2-auto-pull
pm2 set pm2-auto-pull instances 1
pm2 set pm2-auto-pull autorestart false
```

## Support & Documentation

- PM2: https://pm2.keymetrics.io/
- MongoDB: https://docs.mongodb.com/
- Nginx: https://nginx.org/en/docs/
- Let's Encrypt: https://certbot.eff.org/
- SePay API: https://sepay.vn/docs

---

**Questions?** Check logs first, then contact support.
