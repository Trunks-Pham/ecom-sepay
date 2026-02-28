# 🚀 Quick Start Guide

## 5 Minutes to Running Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
# Copy template
cp .env.example .env.local

# Edit with your values (optional for dev)
# SEPAY keys can be added later
```

### 3. Start MongoDB (if local)
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
mongod
```

### 4. Run Development Server
```bash
npm run dev
# Visit http://localhost:3000
```

### 5. Seed Sample Data
```bash
npm run seed
# Creates admin & sample products
```

## Default Accounts

After seeding:
- **Admin**: admin@sepay.local / admin123456
- **User**: user@sepay.local / user123456

## Next Steps

1. **Customize Settings**
   - Edit `.env.local` with SePay credentials
   - Update company name in home page
   - Modify TailwindCSS colors

2. **Add Your Products**
   - Admin → Products → Add Product
   - Upload images
   - Set categories & variants

3. **Configure Payment**
   - Get SePay API keys
   - Update `.env.local`
   - Test QR generation

4. **Deploy to Production**
   - Follow DEPLOYMENT.md guide
   - Run setup-production.sh on VPS
   - Configure domain & SSL

## File Locations

| What | Where |
|------|-------|
| Home Page | `src/app/page.tsx` |
| Admin Dashboard | `src/app/admin/page.tsx` |
| Models | `src/lib/models/` |
| API Routes | `src/app/api/` |
| Styles | `src/app/globals.css` |
| Env Variables | `.env.local` |
| Database | `scripts/seed.ts` |

## Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build production
npm start            # Run production build
npm run lint         # Check code quality
npm run seed         # Seed database

# Database (if using MongoDB locally)
mongosh ecom-sepay   # Connect to database
db.users.find()      # View users
db.products.find()   # View products
```

## Key Features Overview

### Customer Features
- 🔐 Register/Login with JWT
- 🛍️ Browse products by category
- 🔍 Search & filter
- 🛒 Add to cart (ready for implementation)
- 💳 Checkout with SePay QR
- 📋 Order tracking

### Admin Features
- 📊 Dashboard with stats
- ➕ Create/edit products
- 🏷️ Manage categories
- 📦 Track orders
- 💰 Payment receipts
- 🖼️ Upload images locally

## API Quick Reference

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","fullName":"Test","phone":"0901234567"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Get products
curl http://localhost:3000/api/products

# Get single product
curl http://localhost:3000/api/products/{id}
```

## Project Structure (Simplified)

```
src/
├── app/              # Pages & API routes
│   ├── api/          # Backend API
│   ├── admin/        # Admin pages
│   ├── products/     # Product pages
│   └── auth/         # Login/Register
├── lib/
│   ├── db/           # Database connection
│   ├── models/       # MongoDB schemas
│   └── utils/        # Helper functions
└── components/       # React components

public/
└── uploads/          # User uploaded images
```

## Important Notes

1. **Local File Upload**: Images saved to `/public/uploads/`
2. **JWT Tokens**: Valid for 7 days by default
3. **Admin Protection**: Routes check `isAdmin` flag
4. **Passwords**: Hashed with bcryptjs (never stored plain)
5. **SePay**: Webhook signature verification on production

## Troubleshooting

**Port 3000 in use?**
```bash
PORT=3001 npm run dev  # Use different port
```

**MongoDB won't connect?**
```bash
# Check if running
mongosh

# Start if needed
sudo systemctl start mongod
```

**Seed script fails?**
```bash
npm install ts-node --save-dev
npm run seed
```

**Build fails?**
```bash
npm run build         # Check for TypeScript errors
npm run lint --fix    # Fix linting issues
```

## Getting Help

- 📖 Check README.md for full documentation
- 🔗 See API.md for endpoint details
- 📋 Review PROJECT_STRUCTURE.md for file layout
- 🚀 Follow DEPLOYMENT.md for production setup

## What's Included

✅ Next.js 14+ with App Router  
✅ TypeScript for type safety  
✅ MongoDB + Mongoose ORM  
✅ JWT authentication  
✅ Admin dashboard  
✅ Local file uploads  
✅ SePay payment integration  
✅ TailwindCSS UI  
✅ Responsive design  
✅ Production-ready deployment  

## Ready to Deploy?

When ready to go live:

1. Prepare VPS (Ubuntu 20.04+)
2. Run `setup-production.sh`
3. Configure domain
4. Setup SSL with Let's Encrypt
5. Follow DEPLOYMENT.md guide

---

**Need more help?** Check the detailed docs:
- README.md - Full project overview
- API.md - Complete API reference  
- DEPLOYMENT.md - Server setup guide
- PROJECT_STRUCTURE.md - File organization
