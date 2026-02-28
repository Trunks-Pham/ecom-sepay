# ✅ Testing & Pre-Deployment Checklist

## Development Testing (Local)

### Environment Setup
- [ ] Node.js 18+ installed
- [ ] MongoDB running locally
- [ ] `.env.local` configured
- [ ] `npm install` completed without errors
- [ ] No TypeScript errors: `npm run build`

### Initial Server Start
```bash
npm run dev
```
- [ ] Server starts on http://localhost:3000
- [ ] No console errors
- [ ] Home page loads
- [ ] Navigation menu works

### Database Seeding
```bash
npm run seed
```
- [ ] Successfully completes
- [ ] Shows admin credentials
- [ ] 3 categories created
- [ ] 5 sample products created

### Authentication Testing
- [ ] Can access /auth/register
- [ ] Can access /auth/login
- [ ] Can register new user
- [ ] Password validation works
- [ ] Cannot login with wrong password
- [ ] JWT token stored in localStorage
- [ ] Can logout (token cleared)

### Product Management
```bash
# Test as admin (login with seeded admin)
```
- [ ] Can view products list (/products)
- [ ] Can view product detail page
- [ ] Can filter by category
- [ ] Can search products
- [ ] Can view admin dashboard (/admin)

### API Endpoints Testing

#### Authentication Endpoints
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123456","fullName":"Test","phone":"0901234567"}'
# Expected: 201 with user data and token

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sepay.local","password":"admin123456"}'
# Expected: 200 with token

# Get Profile
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/auth/me
# Expected: 200 with user data

# Update Profile
curl -X PUT http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"New Name"}'
# Expected: 200 with updated data
```

- [ ] Auth register returns 201 status
- [ ] Auth login returns token
- [ ] Auth me requires token (401 without)
- [ ] Invalid credentials return 401
- [ ] Duplicate email returns 409

#### Product Endpoints
```bash
# List products
curl http://localhost:3000/api/products?page=1&pageSize=10
# Expected: 200 with paginated products

# Get single product
curl http://localhost:3000/api/products/PRODUCT_ID
# Expected: 200 with product data

# Create product (admin only)
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":100000,...}'
# Expected: 201 when admin, 403 when not admin
```

- [ ] GET /api/products returns 200
- [ ] Pagination works (page, pageSize params)
- [ ] Search filter works
- [ ] Category filter works
- [ ] Price range filter works
- [ ] GET /api/products/:id returns 200
- [ ] Invalid ID returns 404
- [ ] POST requires admin (403 if not)
- [ ] POST creates product with correct data

#### Category Endpoints
```bash
curl http://localhost:3000/api/categories
# Expected: Array of categories
```

- [ ] GET /api/categories returns all
- [ ] POST requires admin flag
- [ ] Can filter products by category
- [ ] Category slug is unique

#### Order Endpoints
```bash
# Create order
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":"...","quantity":1}],...}'
# Expected: 201 with order

# Get user orders
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/orders
# Expected: User sees only their orders
```

- [ ] Can create order as logged-in user
- [ ] User sees only their orders
- [ ] Admin sees all orders
- [ ] Order number generated
- [ ] Shipping cost calculated
- [ ] Tax calculated correctly

#### Payment Endpoints
```bash
# Create payment QR
curl -X POST http://localhost:3000/api/payments/create-qr \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"orderId":"..."}'
# Expected: 200 with QR code
```

- [ ] POST /api/payments/create-qr succeeds
- [ ] Returns QR code data
- [ ] Payment record created
- [ ] Webhook endpoint responds to POST

#### Upload Endpoint
```bash
# Upload file
curl -X POST http://localhost:3000/api/upload/files \
  -H "Authorization: Bearer TOKEN" \
  -F "files=@image.jpg"
# Expected: 200 with file info
```

- [ ] Can upload file as authenticated user
- [ ] File saved to /public/uploads/
- [ ] Returns accessible file URL
- [ ] Rejects unauthenticated requests (401)

### Admin Features
- [ ] Admin can access /admin
- [ ] Admin dashboard shows stats
- [ ] Product management page loads
- [ ] Can create new product form
- [ ] Can edit existing product
- [ ] Can delete product
- [ ] Category management works
- [ ] Order management page loads
- [ ] Can update order status

### Frontend Pages
- [ ] Home page fully renders
- [ ] Product listing page works
- [ ] Product detail page works
- [ ] Cart page accessible
- [ ] Auth pages (login/register) functional
- [ ] Navigation between pages works
- [ ] Mobile responsive (test with DevTools)
- [ ] Error messages display correctly

## Code Quality Checks

### TypeScript & Linting
```bash
npm run lint
npm run build
```
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Build succeeds
- [ ] No console errors in browser

### Database Schema
- [ ] All models have proper types
- [ ] Relationships properly defined
- [ ] Indexes created for frequent queries
- [ ] Validation rules in place
- [ ] Required fields properly marked

### API Response Format
- [ ] All success responses use successResponse()
- [ ] All errors use errorResponse()
- [ ] Pagination uses paginatedResponse()
- [ ] Status codes correct (201 for create, 400 for bad request, etc.)
- [ ] Error messages helpful and user-friendly

## Security Checks

### Authentication & Authorization
- [ ] Passwords hashed (never plain text in DB)
- [ ] JWT tokens verified before accessing protected routes
- [ ] Admin routes check isAdmin flag
- [ ] Users can only access their own data
- [ ] No sensitive data in JWT payload

### Input Validation
```typescript
// Check all endpoints validate input
- [ ] Email format validated
- [ ] Password minimum length enforced
- [ ] Required fields check
- [ ] Type checking
- [ ] String trimming & sanitization
```

### Environment Variables
- [ ] All secrets in .env.local (not in code)
- [ ] .env.local in .gitignore
- [ ] .env.example has no real values
- [ ] JWT_SECRET is unique (not default)
- [ ] SEPAY credentials secured

### File Upload Security
- [ ] File extensions validated
- [ ] File size limited (50MB)
- [ ] Files saved outside webroot in production
- [ ] Filenames sanitized (timestamp + random)
- [ ] Access requires authentication

## Performance Testing

### Load Testing
- [ ] Product list loads quickly (<2s)
- [ ] Product detail loads quickly
- [ ] Search responds fast
- [ ] Database queries use pagination
- [ ] No N+1 query problems

### Asset Optimization
- [ ] CSS properly bundled (TailwindCSS)
- [ ] JavaScript minified in production
- [ ] Images optimized
- [ ] Static files cached

## Browser Testing

### Desktop Browsers
- [ ] Chrome: Full functionality
- [ ] Firefox: Full functionality
- [ ] Safari: Full functionality
- [ ] Edge: Full functionality

### Mobile Browsers
- [ ] iOS Safari: Responsive layout
- [ ] Android Chrome: Responsive layout
- [ ] Touch navigation works
- [ ] Product images display correctly

### Responsive Design
- [ ] Mobile (375px): Single column layout
- [ ] Tablet (768px): 2 column layout
- [ ] Desktop (1024px+): 3+ column layout
- [ ] No horizontal scrolling
- [ ] Touch targets adequate (44px minimum)

## Deployment Pre-Checks

### Before Production Deployment

```bash
# 1. Final build
npm run build
# Expected: Success, output in .next/

# 2. Check environment
cat .env.local
# Should have unique JWT_SECRET, valid SEPAY keys

# 3. Database backup (if migrating)
mongodump --db ecom-sepay -o ./backup/

# 4. Test production build locally
npm start
# Visit http://localhost:3000 and test key features
```

- [ ] Production build succeeds
- [ ] npm start works
- [ ] Can login in production build
- [ ] Can view products
- [ ] API endpoints respond correctly

### Server Preparation (Ubuntu 20.04+)
- [ ] Server updated: `sudo apt update && sudo apt upgrade`
- [ ] Node.js 18+ installed: `node --version`
- [ ] MongoDB installed and running: `sudo systemctl status mongod`
- [ ] Nginx installed: `sudo systemctl status nginx`
- [ ] PM2 installed globally: `pm2 --version`
- [ ] Firewall configured (ufw)
- [ ] SSH keys set up
- [ ] Domain DNS configured
- [ ] SSL certificate ready (Let's Encrypt)

### Application Deployment
- [ ] Code pushed to git repository
- [ ] .env.local created on server with production values
- [ ] `npm install` completed on server
- [ ] `npm run build` succeeds on server
- [ ] `npm run seed` executed (sample data)
- [ ] Nginx reverse proxy configured
- [ ] PM2 ecosystem.config.js copied
- [ ] `pm2 start ecosystem.config.js` running
- [ ] SSL certificate installed and working
- [ ] Auto-renewal set up (certbot)

### Post-Deployment Verification
```bash
# On production server
pm2 status            # Should show running
pm2 logs ecom-sepay   # Should show no errors
curl localhost:3000   # Should return HTML
curl https://yourdomain.com/api/products  # Should work
```

- [ ] App accessible via domain
- [ ] HTTPS working (no SSL warnings)
- [ ] Home page loads
- [ ] API endpoints respond
- [ ] Database connected
- [ ] Logs show no errors
- [ ] Admin functionality works
- [ ] Products display correctly
- [ ] File uploads working (to public/uploads)
- [ ] SePay QR generation works

## Monitoring Post-Deployment

### Application Health
```bash
# Check running processes
pm2 status

# View logs
pm2 logs ecom-sepay

# Monitor system resources
pm2 monit

# Check MongoDB
mongosh
show dbs
```

- [ ] PM2 shows "online" status
- [ ] No error logs
- [ ] No crashes or restarts
- [ ] Disk space adequate (df -h)
- [ ] Memory usage reasonable

### Database Health
```bash
mongosh ecom-sepay
db.stats()
db.users.count()
db.products.count()
db.orders.count()
```

- [ ] Database accessible
- [ ] Expected data present
- [ ] Collections have documents
- [ ] No replication errors

### Security Monitoring
- [ ] SSL certificate not expired
- [ ] No console errors
- [ ] No unhandled exceptions
- [ ] Admin access logs clean
- [ ] Failed login attempts monitored

## Performance Monitoring

### Response Times
- [ ] GET /api/products: <500ms
- [ ] GET /api/products/:id: <300ms
- [ ] POST /api/auth/login: <200ms
- [ ] POST /api/orders: <500ms
- [ ] Page load: <3s

### Resource Usage
- [ ] CPU: <70% average
- [ ] Memory: <500MB
- [ ] Disk space: >10GB free
- [ ] Database size: <1GB (adjust as grows)

## Rollback Plan

If issues found in production:

```bash
# 1. Stop application
pm2 stop ecom-sepay

# 2. Restore previous version
git checkout PREVIOUS_COMMIT
npm install
npm run build

# 3. Restore database from backup
mongorestore --db ecom-sepay ./backup/ecom-sepay

# 4. Restart
pm2 start ecosystem.config.js

# 5. Verify
curl https://yourdomain.com
```

- [ ] Backup location known
- [ ] Previous version tagged in git
- [ ] Rollback procedure documented
- [ ] Team knows rollback process
- [ ] RTO/RPO targets defined

## Ongoing Maintenance

### Weekly
- [ ] Check error logs: `pm2 logs`
- [ ] Verify disk space: `df -h`
- [ ] Check MongoDB size: `db.stats()`
- [ ] Review user registrations

### Monthly
- [ ] Database backup: `mongodump`
- [ ] Update npm packages (minor): `npm update`
- [ ] Review security updates: `npm audit`
- [ ] Check SSL certificate expiry
- [ ] Review admin logs

### Quarterly
- [ ] Security audit
- [ ] Performance optimization
- [ ] Database cleanup (old orders)
- [ ] Backup management (delete old backups)

## Issue Tracking

Create GitHub issues for:
- [ ] Feature requests
- [ ] Bug reports
- [ ] Performance issues
- [ ] Security concerns
- [ ] Documentation improvements

---

## Testing Summary

**Total Checklist Items**: ~100+

**Critical Path** (must pass):
1. ✅ Server starts without errors
2. ✅ Database connects
3. ✅ Auth flow works
4. ✅ Products display
5. ✅ Admin can manage products
6. ✅ Orders can be created
7. ✅ No TypeScript errors
8. ✅ HTTPS works (production)
9. ✅ App is responsive

**Deployment Readiness**: When all critical items pass ✅

---

**Document Last Updated**: 2024
**Checklist Version**: 1.0
