# 📋 Project Structure & File Guide

## Complete Directory Tree

```
ecom-sepay/
├── src/
│   ├── app/
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── register/route.ts
│   │   │   │   └── me/route.ts
│   │   │   ├── categories/
│   │   │   │   ├── route.ts          # GET all, POST create (admin)
│   │   │   │   └── [id]/route.ts     # GET, PUT, DELETE (admin)
│   │   │   ├── products/
│   │   │   │   ├── route.ts          # GET all, POST create (admin)
│   │   │   │   └── [id]/route.ts     # GET, PUT, DELETE (admin)
│   │   │   ├── orders/
│   │   │   │   ├── route.ts          # GET user orders, POST create
│   │   │   │   └── [id]/route.ts     # GET detail, PUT status (admin)
│   │   │   ├── payments/
│   │   │   │   ├── create-qr/route.ts    # Generate SePay QR
│   │   │   │   └── webhook/route.ts     # SePay webhook
│   │   │   └── upload/
│   │   │       ├── route.ts
│   │   │       └── files/route.ts    # Handle file uploads
│   │   │
│   │   ├── admin/                    # Admin Pages
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   ├── products/
│   │   │   │   └── page.tsx          # Products management
│   │   │   ├── categories/
│   │   │   │   └── page.tsx          # Categories management
│   │   │   └── orders/
│   │   │       └── page.tsx          # Orders management
│   │   │
│   │   ├── auth/                     # Auth Pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── products/                 # Product Pages
│   │   │   ├── page.tsx              # Product listing
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Product detail
│   │   │
│   │   ├── cart/
│   │   │   └── page.tsx              # Shopping cart
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   └── globals.css               # Global styles
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   └── mongodb.ts            # MongoDB connection
│   │   │
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── User.ts               # User model
│   │   │   ├── Category.ts           # Category model
│   │   │   ├── Product.ts            # Product model with variants
│   │   │   ├── Order.ts              # Order model
│   │   │   └── Payment.ts            # Payment model
│   │   │
│   │   └── utils/                    # Helper functions
│   │       ├── jwt.ts                # JWT operations
│   │       ├── password.ts           # Bcrypt password hashing
│   │       ├── sepay.ts              # SePay API integration
│   │       ├── api.ts                # API response formatting
│   │       ├── auth.ts               # Auth middleware & checks
│   │       └── helpers.ts            # Business logic helpers
│   │
│   ├── components/
│   │   └── common/                   # Reusable components
│   │       └── (to be expanded)
│   │
│   └── middleware.ts                 # Next.js middleware (if needed)
│
├── public/
│   ├── uploads/                      # Local file storage
│   │   └── .gitkeep
│   └── (static assets)
│
├── scripts/
│   └── seed.ts                       # Database seeding script
│
├── logs/                             # Application logs (created at runtime)
│   └── .gitkeep
│
├── .env.local                        # Local environment variables (gitignored)
├── .env.example                      # Environment template
├── .gitignore                        # Git ignore rules
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── postcss.config.mjs                # PostCSS configuration
├── eslint.config.mjs                 # ESLint configuration
│
├── README.md                         # Project documentation
├── API.md                            # API documentation
├── DEPLOYMENT.md                     # Deployment guide
├── PROJECT_STRUCTURE.md              # This file
│
├── nginx.conf                        # Nginx reverse proxy config
├── ecosystem.config.js               # PM2 configuration
├── setup-production.sh               # Production setup script
├── post-deploy.sh                    # Post-deployment script
│
└── node_modules/                     # Dependencies (gitignored)
```

## Key Files Explanation

### API Routes (`src/app/api/`)

| File | Method | Purpose |
|------|--------|---------|
| `auth/register/route.ts` | POST | User registration |
| `auth/login/route.ts` | POST | User login |
| `auth/me/route.ts` | GET/PUT | Current user profile |
| `products/route.ts` | GET/POST | List & create products |
| `products/[id]/route.ts` | GET/PUT/DELETE | Product operations |
| `categories/route.ts` | GET/POST | List & create categories |
| `categories/[id]/route.ts` | GET/PUT/DELETE | Category operations |
| `orders/route.ts` | GET/POST | List & create orders |
| `orders/[id]/route.ts` | GET/PUT | Order detail & updates |
| `payments/create-qr/route.ts` | POST | Generate SePay QR |
| `payments/webhook/route.ts` | POST | SePay webhook handler |
| `upload/files/route.ts` | POST | File upload handler |

### Data Models (`src/lib/models/`)

#### User.ts
- Email authentication
- Profile information
- Admin flag
- Addresses

#### Category.ts
- Product categories
- Slug for URL routing
- Icon & order

#### Product.ts
- Product details
- Product variants (Size, Color, etc.)
- Custom fields (Engraving, Design)
- Images & thumbnail
- Stock management
- Ratings & reviews

#### Order.ts
- Order details
- Shipping address
- Order items with variants
- Payment & order status
- Shipping cost & tax calculation

#### Payment.ts
- Payment transactions
- SePay integration
- Payment status tracking
- Refund handling

### Utility Functions (`src/lib/utils/`)

#### jwt.ts
- Generate JWT tokens
- Verify tokens
- Extract from headers

#### password.ts
- Hash passwords with bcryptjs
- Compare password for login

#### sepay.ts
- Generate QR codes
- Verify webhook signatures
- Handle payment responses

#### api.ts
- Format success responses
- Format error responses
- Paginate results

#### auth.ts
- Authenticate requests
- Check admin permissions
- Return error responses

#### helpers.ts
- Generate order numbers
- Create URL slugs
- Format currency
- Calculate shipping fees

## Configuration Files

### .env.local
```env
# Database
MONGODB_URI=mongodb://localhost:27017/ecom-sepay

# Authentication
JWT_SECRET=secure-random-key

# Payment
SEPAY_CLIENT_ID=...
SEPAY_API_KEY=...
SEPAY_WEBHOOK_SECRET=...

# URLs
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",           // Development server
    "build": "next build",       // Production build
    "start": "next start",       // Production start
    "lint": "eslint",            // Lint code
    "seed": "ts-node ..."        // Seed database
  }
}
```

### ecosystem.config.js (PM2)
- Cluster mode with max instances
- Graceful shutdown configuration
- Log file locations
- Deployment configuration

### nginx.conf
- SSL/TLS configuration
- Reverse proxy setup
- Gzip compression
- Static file caching
- Security headers

## Data Flow

### User Registration/Login
```
Frontend Form → /api/auth/register → Hash pwd → Save User → Issue JWT
```

### Product Creation
```
Admin Form → /api/products (POST) → Verify Admin → Save to DB → Return Product
```

### File Upload
```
Admin Upload → /api/upload/files → Save to /public/uploads → Return URL
```

### Order Creation
```
Cart → /api/orders (POST) → Create Order → Calculate Shipping/Tax → Return Order Number
```

### Payment Processing
```
/api/payments/create-qr → SePay API → Generate QR → User Scans & Pays
→ SePay Webhook → /api/payments/webhook → Update Order/Payment Status
```

## Authentication Flow

```
1. User logs in: POST /api/auth/login
2. Server returns JWT token
3. Frontend stores token in localStorage
4. For protected routes: Send token in Authorization header
5. Server validates JWT & checks isAdmin flag
6. Request proceeds or returns 401/403
```

## Database Schema Relationships

```
User
  ├── Many Orders (Order.userId)
  └── Many Payments (Payment.userId)

Category
  └── Many Products (Product.category)

Product
  └── Many OrderItems (OrderItem.productId)

Order
  ├── One User (Order.userId)
  ├── Many OrderItems
  └── One Payment (via orderId)

Payment
  ├── One User (Payment.userId)
  └── One Order (Payment.orderId)
```

## Adding New Features

### 1. Add New Product Category
```bash
# 1. Update if needed in Category.ts
# Already flexible - just add to database

# 2. Create products in that category via API
POST /api/products
```

### 3. Create Admin Page
```bash
# 1. Create new folder in src/app/admin/[feature]
# 2. Create page.tsx with admin check
# 3. Add navigation link in admin dashboard
```

### 4. Add API Endpoint
```bash
# 1. Create src/app/api/[resource]/route.ts
# 2. Implement GET/POST (and PUT/DELETE if needed)
# 3. Add authentication check if needed
# 4. Return proper response format
# 5. Edit API.md with new endpoint docs
```

### 5. Add New Custom Field to Product
```bash
# Already supported via Product.customFields array
# No schema change needed
```

## Troubleshooting File Structure

**Missing file?**
```bash
# Find files by name
find . -name "*.ts" -type f

# Check if built correctly
npm run build

# Check imports
grep -r "from '@/lib" src/app/api/
```

**API not working?**
```bash
# Check route exists
ls -la src/app/api/[resource]/route.ts

# Test endpoint
curl http://localhost:3000/api/[resource]
```

---

This structure is production-ready but can be extended:
- Add more models if needed
- Create component subfolder as UI grows
- Add middleware for specific features
- Create utility subfolder for shared helpers
