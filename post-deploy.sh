#!/bin/bash
# Post-deployment script for final setup
# Run this after the application is deployed

echo "🔍 Post-deployment configuration..."

# Check MongoDB
echo "Checking MongoDB connection..."
if mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB is not running - please check"
    exit 1
fi

# Seed database if empty
echo "Checking if database needs seeding..."
cd /var/www/ecom-sepay

# Check if collections exist
COLLECTION_COUNT=$(mongosh ecom-sepay --eval "db.users.countDocuments()" --quiet || echo "0")

if [ "$COLLECTION_COUNT" -eq "0" ]; then
    echo "🌱 Database is empty, running seed..."
    npm run seed
else
    echo "✅ Database already has data, skipping seed"
fi

# Test API endpoints
echo "Testing API endpoints..."
curl -s http://localhost:3000 > /dev/null && echo "✅ API is responding" || echo "⚠️  API not yet responding"

# Setup logs rotation
echo "Setting up log rotation..."
cat > /etc/logrotate.d/ecom-sepay << 'EOF'
/var/www/ecom-sepay/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 $USER $USER
    sharedscripts
    postrotate
        pm2 reload ecom-sepay > /dev/null 2>&1 || true
    endscript
}
EOF

echo "✅ Post-deployment setup complete!"
echo ""
echo "📊 Monitor application:"
echo "  pm2 status"
echo "  pm2 logs ecom-sepay"
echo "  pm2 monit"
