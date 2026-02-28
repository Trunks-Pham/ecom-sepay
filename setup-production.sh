#!/bin/bash
# Deployment setup script for Ubuntu VPS
# Usage: sudo ./setup-production.sh

set -e

echo "🚀 EcomSePay Production Setup"
echo "=============================="

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 20
echo "📦 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
echo "📦 Installing MongoDB..."
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt-get install -y nginx
sudo systemctl enable nginx

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Certbot for SSL
echo "📦 Installing Certbot..."
sudo apt-get install -y certbot python3-certbot-nginx

# Create app directory
echo "📁 Creating app directory..."
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www

# Clone repository
echo "🔧 Cloning repository..."
cd /var/www
git clone https://github.com/your-repo/ecom-sepay.git || true
cd ecom-sepay

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build application
echo "🔨 Building application..."
npm run build

# Create .env.local
echo "📝 Creating .env.local..."
cat > .env.local << EOF
MONGODB_URI=mongodb://localhost:27017/ecom-sepay
JWT_SECRET=$(openssl rand -base64 32)
SEPAY_CLIENT_ID=your-sepay-client-id
SEPAY_API_KEY=your-sepay-api-key
SEPAY_WEBHOOK_SECRET=$(openssl rand -base64 32)
SEPAY_API_URL=https://api.sepay.vn
NEXT_PUBLIC_API_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
EOF

echo "⚠️  Update .env.local with your actual SePay credentials"

# Create logs directory
mkdir -p ./logs

# Copy Nginx configuration
echo "🔧 Configuring Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/ecom-sepay
sudo sed -i 's/your-domain.com/REPLACE_WITH_YOUR_DOMAIN/g' /etc/nginx/sites-available/ecom-sepay
sudo ln -sf /etc/nginx/sites-available/ecom-sepay /etc/nginx/sites-enabled/ecom-sepay

# Test Nginx
sudo nginx -t

# Setup SSL with Let's Encrypt
echo "🔒 Setting up SSL certificate..."
sudo certbot certonly --nginx -d REPLACE_WITH_YOUR_DOMAIN -n --agree-tos -m your-email@example.com || echo "SSL setup deferred - run manually"

# Start PM2
echo "🚀 Starting application with PM2..."
pm2 start npm --name "ecom-sepay" -- start
pm2 startup
pm2 save

# Start Nginx
echo "🌐 Starting Nginx..."
sudo systemctl restart nginx

# Seed database
echo "🌱 Seeding database..."
npm run seed || echo "Seeding optional - can run manually later"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update .env.local with SePay credentials at /var/www/ecom-sepay/.env.local"
echo "2. Update Nginx config with your domain: sudo nano /etc/nginx/sites-available/ecom-sepay"
echo "3. Setup SSL: sudo certbot certonly --nginx -d your-domain.com"
echo "4. Restart Nginx: sudo systemctl restart nginx"
echo "5. Check application: pm2 logs ecom-sepay"
echo ""
echo "🔗 Application should be running at: https://your-domain.com"
echo "📊 Check status: pm2 status"
echo "📋 View logs: pm2 logs ecom-sepay"
