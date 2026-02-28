# 👨‍💻 Developer Guide

## Development Environment Setup

### Prerequisites
- Node.js 18+ (check: `node --version`)
- MongoDB 5.0+ (check: `mongosh --version`)
- Git
- VS Code (recommended)

### Initial Setup

```bash
# 1. Clone repository
git clone <your-repo>
cd ecom-sepay

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Edit environment file with your details
# CRITICAL: Set a unique JWT_SECRET
# OPTIONAL: Add SePay credentials later

# 5. Start MongoDB
mongod  # in separate terminal

# 6. Start development server
npm run dev

# 7. Seed database with sample data
npm run seed

# 8. Visit http://localhost:3000
```

## Development Workflow

### Making Code Changes

1. **Edit files** in `src/` directory
2. **Auto-reload**: Next.js hot-reload watches changes
3. **Check errors**: VS Code shows TypeScript errors
4. **Run linter**: `npm run lint --fix`
5. **Test APIs**: Use curl, Postman, or API client

### Adding a New Product

```bash
# Option 1: Use Admin UI
1. Login with admin credentials
2. Go to Admin → Products → Add Product
3. Fill form and submit
4. Image uploads to /public/uploads/

# Option 2: Use API directly
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "T-Shirt",
    "description": "Comfortable cotton tee",
    "price": 199000,
    "comparePrice": 299000,
    "stock": 50,
    "category": "ObjectId_from_db",
    "images": ["/uploads/image.jpg"]
  }'
```

### Creating New API Endpoint

```typescript
// 1. Create file src/app/api/[resource]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { authenticate, forbidden } from '@/lib/utils/auth';
import { successResponse, errorResponse } from '@/lib/utils/api';
import { connectDB } from '@/lib/db/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get current user if needed
    const user = await authenticate(request);
    if (!user) {
      return unauthorized();
    }
    
    // Authorization check
    if (user.role !== 'admin') {
      return forbidden();
    }
    
    // Your logic here
    
    return NextResponse.json(successResponse(data, 'Success'));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      errorResponse('Server error'),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectDB();
    
    // Validation
    if (!body.name) {
      return NextResponse.json(
        errorResponse('Name is required'),
        { status: 400 }
      );
    }
    
    // Your logic here
    
    return NextResponse.json(successResponse(result), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      errorResponse('Server error'),
      { status: 500 }
    );
  }
}
```

### Adding a New Page

```typescript
// 1. Create file src/app/[feature]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FeaturePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/endpoint', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch');
        
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Feature</h1>
      {/* Your content here */}
    </main>
  );
}
```

### Creating Database Migration

```typescript
// Create: scripts/migrations/001_add_field.ts

import { connectDB } from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';

async function migrate() {
  try {
    await connectDB();
    
    // Update existing records
    await Product.updateMany({}, {
      $set: { 'newField': 'defaultValue' }
    });
    
    console.log('Migration completed');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();

// Run with: npx ts-node scripts/migrations/001_add_field.ts
```

## Testing

### Manual Testing

```bash
# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "fullName": "Test User",
    "phone": "0901234567"
  }'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'

# Test protected endpoint (replace TOKEN with actual JWT)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/auth/me
```

### Using Postman

1. Import API.md endpoints
2. Set variables:
   - `base_url`: http://localhost:3000
   - `token`: From login response
3. Test collections:
   - Auth flow
   - Product CRUD
   - Order creation
   - Payment integration

## Debugging Tips

### Enable Debug Logging

```typescript
// In any file:
console.log('Debug:', variable);

// View in terminal where `npm run dev` is running
```

### Check MongoDB Connection

```bash
# Connect to database
mongosh ecom-sepay

# View collections
show collections

# Check data
db.users.find()
db.products.find()
db.orders.find()
```

### Debug API Requests

```typescript
// In route handler
console.log('Request body:', await request.json());
console.log('Headers:', Object.fromEntries(request.headers));
console.log('User:', user);
```

### TypeScript Errors

```bash
# Check for type errors
npm run build

# Fix common issues
npm run lint --fix

# Install missing types
npm install --save-dev @types/node-fetch
```

## Code Style & Best Practices

### Naming Conventions

```typescript
// Files
- useHook.ts (React hooks)
- Component.tsx (React components)
- model.ts (Mongoose models)
- route.ts (API routes)

// Functions
- async function fetchData() {} // camelCase
- function generateToken() {} // camelCase
- class UserModel {} // PascalCase

// Constants
const API_URL = 'http://...' // UPPER_SNAKE_CASE
const maxRetries = 3; // camelCase
```

### Error Handling

```typescript
// Always wrap API calls
try {
  const response = await fetch('/api/endpoint');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
} catch (error) {
  console.error('API Error:', error);
  // Show user-friendly message
  setError('Failed to load data');
}
```

### API Response Pattern

```typescript
// Success
return NextResponse.json(
  successResponse(data, 'Operation successful'),
  { status: 200 }
);

// Error
return NextResponse.json(
  errorResponse('Detailed error message'),
  { status: 400 }
);

// Paginated
return NextResponse.json(
  paginatedResponse(items, total, page, pageSize)
);
```

### Component Structure

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function MyComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Side effects
  }, []);
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

## Performance Tips

### 1. React Component Optimization
```typescript
// Use useMemo for expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Use useCallback to prevent unnecessary re-renders
const handleClick = useCallback(() => {
  // action
}, []);
```

### 2. Database Queries
```typescript
// Use indexes for faster queries
// Add to schema:
userSchema.index({ email: 1 });

// Use select() to fetch only needed fields
Product.find().select('name price -__v')

// Use lean() for read-only queries (faster)
Product.find().lean()
```

### 3. Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image 
  src="/uploads/image.jpg" 
  alt="..." 
  width={300} 
  height={300}
/>
```

### 4. API Pagination
```typescript
// Limit results
GET /api/products?page=1&pageSize=20

// Always paginate large datasets
const skip = (page - 1) * pageSize;
const items = await Product.find().skip(skip).limit(pageSize);
```

## Security Checklist

- [ ] Change JWT_SECRET to unique value
- [ ] Add SePay API keys securely
- [ ] Use HTTPS in production
- [ ] Set secure cookies with httpOnly
- [ ] Validate all user inputs
- [ ] Check isAdmin before admin operations
- [ ] Rate limit API endpoints
- [ ] Log all admin actions
- [ ] Regular security updates
- [ ] Backup database regularly

## Common Tasks

### Reset Database
```bash
# Delete all data
mongosh ecom-sepay
db.dropDatabase()

# Reseed
npm run seed
```

### Export Data
```bash
# Users
mongodump --db ecom-sepay --collection users

# All data
mongodump --db ecom-sepay

# To restore
mongorestore dump/ecom-sepay
```

### Monitor Logs
```bash
# Development logs
# Check terminal where npm run dev is running

# Production logs (deployed)
pm2 logs ecom-sepay
tail -f logs/error.log
```

## VS Code Extensions

Recommended extensions for development:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "mongodb.mongodb-vscode",
    "Prisma.prisma",
    "bradlc.vscode-tailwindcss",
    "ms-azuretools.vscode-docker"
  ]
}
```

## Troubleshooting Development Issues

### Hot reload not working
```bash
# Solution: Restart dev server
# Press Ctrl+C in terminal
npm run dev
```

### MongoDB connection timeout
```bash
# Check if running
mongosh

# Start if needed
mongod

# Check MONGODB_URI in .env.local
```

### TypeScript errors in editor
```bash
# Reload TypeScript
Ctrl+Shift+P → TypeScript: Restart TS Server

# Or restart VS Code
```

### Port 3000 in use
```bash
# Use different port
PORT=3001 npm run dev

# Or kill process
lsof -i :3000
kill -9 <PID>
```

## Project Dependencies Overview

| Package | Purpose | Version |
|---------|---------|---------|
| next | React framework | 14+ |
| mongoose | MongoDB ORM | 9+ |
| jsonwebtoken | JWT auth | 9+ |
| bcryptjs | Password hashing | 3+ |
| axios | HTTP client | 1+ |
| react | UI library | 19+ |
| typescript | Type safety | 5+ |
| tailwindcss | CSS framework | 3+ |

## Getting Help

1. **Check existing documentation**
   - README.md - Overview
   - API.md - Endpoints
   - PROJECT_STRUCTURE.md - File layout

2. **Search codebase**
   - Similar features already implemented
   - Look at existing models/routes

3. **External resources**
   - Next.js docs: https://nextjs.org/docs
   - Mongoose docs: https://mongoosejs.com/
   - TypeScript docs: https://www.typescriptlang.org/docs/

---

Happy coding! 🚀
