# 📚 API Documentation

## Base URL
- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com`

## Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer {token}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error info"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "items": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "pageSize": 10,
      "totalPages": 10
    }
  }
}
```

## Endpoints

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "0901234567"
}

Response:
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "fullName": "John Doe",
      "isAdmin": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "..."
  }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Success",
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "fullName": "John Doe",
      "phone": "0901234567",
      "avatar": null,
      "isAdmin": false,
      "address": "123 Main St",
      "city": "Ho Chi Minh",
      "country": "Vietnam",
      "zipCode": "700000"
    }
  }
}
```

#### Update Profile
```
PUT /api/auth/me
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "fullName": "Jane Doe",
  "phone": "0909876543",
  "address": "456 New St",
  "city": "Hanoi"
}

Response: { updated user object }
```

### Products

#### Get Products (with filters & pagination)
```
GET /api/products?page=1&pageSize=12&category=fashion&search=shirt&minPrice=0&maxPrice=1000000&featured=false

Query Parameters:
- page (default: 1)
- pageSize (default: 12)
- category (optional): product category ID
- search (optional): search term
- minPrice (optional)
- maxPrice (optional)
- featured (optional): "true" or "false"

Response:
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "...",
        "name": "T-Shirt",
        "slug": "t-shirt",
        "description": "...",
        "price": 199000,
        "stock": 50,
        "thumbnail": "/uploads/image.jpg",
        "images": ["..."],
        "variants": [
          {
            "name": "Size",
            "options": ["S", "M", "L", "XL"]
          }
        ],
        "isFeatured": true,
        "ratings": 4.5,
        "reviews": 128
      }
    ],
    "pagination": {
      "total": 245,
      "page": 1,
      "pageSize": 12,
      "totalPages": 21
    }
  }
}
```

#### Get Product Detail
```
GET /api/products/:id

Response:
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Premium T-Shirt",
    "slug": "premium-t-shirt",
    "description": "High quality cotton t-shirt",
    "category": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Thời trang",
      "slug": "thoi-trang"
    },
    "price": 199000,
    "comparePrice": 299000,
    "stock": 50,
    "thumbnail": "/uploads/thumbnail.jpg",
    "images": [
      "/uploads/image1.jpg",
      "/uploads/image2.jpg"
    ],
    "variants": [
      {
        "name": "Size",
        "options": ["S", "M", "L", "XL", "XXL"]
      },
      {
        "name": "Color",
        "options": ["White", "Black", "Blue", "Red"]
      }
    ],
    "customFields": [],
    "sku": "TSHIRT-001",
    "isActive": true,
    "isFeatured": true,
    "ratings": 4.5,
    "reviews": 128,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Create Product (Admin)
```
POST /api/products
Authorization: Bearer {admin-token}
Content-Type: application/json

Body:
{
  "name": "New Product",
  "description": "Product description",
  "category": "507f1f77bcf86cd799439012",
  "price": 299000,
  "comparePrice": 399000,
  "stock": 100,
  "images": ["/uploads/img1.jpg", "/uploads/img2.jpg"],
  "thumbnail": "/uploads/img1.jpg",
  "variants": [
    {
      "name": "Size",
      "options": ["S", "M", "L"]
    }
  ],
  "customFields": [
    {
      "fieldName": "Engraving Text",
      "fieldType": "text",
      "required": false
    }
  ],
  "sku": "SKU-001"
}

Response: { created product }
```

#### Update Product (Admin)
```
PUT /api/products/:id
Authorization: Bearer {admin-token}
Content-Type: application/json

Body: { fields to update }

Response: { updated product }
```

#### Delete Product (Admin)
```
DELETE /api/products/:id
Authorization: Bearer {admin-token}

Response:
{
  "success": true,
  "message": "Product deleted"
}
```

### Categories

#### Get All Categories
```
GET /api/categories

Response:
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Fashion",
      "slug": "fashion",
      "description": "Clothing and accessories",
      "icon": "👕",
      "order": 1
    },
    ...
  ]
}
```

#### Get Category Detail
```
GET /api/categories/:id

Response: { category object }
```

#### Create Category (Admin)
```
POST /api/categories
Authorization: Bearer {admin-token}
Content-Type: application/json

Body:
{
  "name": "New Category",
  "description": "Category description",
  "icon": "🎁",
  "order": 1
}

Response: { created category }
```

#### Update Category (Admin)
```
PUT /api/categories/:id
Authorization: Bearer {admin-token}
Content-Type: application/json

Body: { fields to update }
```

#### Delete Category (Admin)
```
DELETE /api/categories/:id
Authorization: Bearer {admin-token}
```

### Orders

#### Get Orders
```
GET /api/orders?page=1&pageSize=10
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "...",
        "orderNumber": "ORD-240115-ABC123",
        "userId": "...",
        "items": [
          {
            "productId": "...",
            "productName": "T-Shirt",
            "quantity": 2,
            "price": 199000,
            "variant": { "size": "M", "color": "Black" },
            "customFields": { "engraving": "John" }
          }
        ],
        "status": "pending",
        "paymentStatus": "pending",
        "totalAmount": 398000,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

#### Get Order Detail
```
GET /api/orders/:id
Authorization: Bearer {token}

Response: { detailed order with populated user/product data }
```

#### Create Order
```
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "productName": "T-Shirt",
      "quantity": 2,
      "price": 199000,
      "variant": { "size": "M", "color": "Black" },
      "customFields": { "engraving": "John" }
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "0901234567",
    "address": "123 Main St",
    "city": "Ho Chi Minh",
    "country": "Vietnam",
    "zipCode": "700000"
  },
  "paymentMethod": "sepay",
  "subtotal": 398000,
  "shippingCost": 30000,
  "tax": 42800,
  "totalAmount": 470800,
  "notes": "Please deliver in the morning"
}

Response:
{
  "success": true,
  "message": "Order created",
  "data": {
    "_id": "...",
    "orderNumber": "ORD-240115-ABC123",
    ...
  }
}
```

#### Update Order Status (Admin)
```
PUT /api/orders/:id
Authorization: Bearer {admin-token}
Content-Type: application/json

Body:
{
  "status": "confirmed",
  "paymentStatus": "completed",
  "trackingNumber": "VN123456789"
}

Response: { updated order }
```

### Payments

#### Create SePay QR
```
POST /api/payments/create-qr
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "orderId": "507f1f77bcf86cd799439011"
}

Response:
{
  "success": true,
  "message": "QR code generated",
  "data": {
    "orderId": "...",
    "paymentId": "...",
    "qrCode": "data:image/png;base64,...",
    "amount": 470800,
    "description": "Payment for order ORD-240115-ABC123"
  }
}
```

#### Payment Webhook (SePay)
```
POST /api/payments/webhook
Content-Type: application/json
X-SePay-Signature: {signature}

Body:
{
  "transaction_id": "SEPAY123456",
  "amount": 470800,
  "description": "Payment for order ORD-240115-ABC123",
  "status": "completed",
  "order_id": "507f1f77bcf86cd799439011"
}

Response:
{
  "success": true,
  "message": "Payment processed successfully"
}
```

### File Upload

#### Upload Files
```
POST /api/upload/files
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
files: [File1, File2, ...]

Response:
{
  "success": true,
  "message": "Files uploaded successfully",
  "data": [
    {
      "filename": "1234567890-abc123.jpg",
      "url": "/uploads/1234567890-abc123.jpg"
    },
    ...
  ]
}
```

## Error Codes

| Status | Message | Description |
|--------|---------|-------------|
| 400 | Bad Request | Missing or invalid parameters |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions (non-admin) |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Email already exists |
| 500 | Server Error | Internal server error |

## Rate Limiting

Current implementation: No rate limiting (add in production)

## Postman Collection

Import the included postman-collection.json file in Postman to test all endpoints.

## Testing Examples

### CURL Examples

**Register**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@test.com",
    "password":"123456",
    "fullName":"Test User",
    "phone":"0901234567"
  }'
```

**Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

**Get Products**
```bash
curl "http://localhost:3000/api/products?page=1&category=fashion"
```

**Create Product (requires token)**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{...product data...}'
```

## Webhook Signature Verification

When receiving webhooks from SePay, verify the signature:

```
X-SePay-Signature header contains HMAC-SHA256
Algorithm: HMAC-SHA256(body, SEPAY_WEBHOOK_SECRET)
```
