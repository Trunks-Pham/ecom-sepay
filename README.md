# EcomSePay - E-Commerce Platform

✨ **Website thương mại điện tử hiện đại với Next.js, MongoDB & SePay Payment Integration**

## 🎯 Tính năng chính

### Cho người dùng
- ✅ Đăng ký / Đăng nhập (JWT authentication)
- ✅ Xem danh mục sản phẩm: Thời trang, Hoa tươi, Đồ công nghệ
- ✅ Tìm kiếm & lọc sản phẩm (theo giá, danh mục)
- ✅ Xem chi tiết sản phẩm với gallery ảnh
- ✅ Chọn biến thể (size, màu) & custom field (khắc tên, design)
- ✅ Giỏ hàng (tính toán tự động phí vận chuyển & thuế)
- ✅ Thanh toán qua **SePay QR Code**
- ✅ Theo dõi trạng thái đơn hàng
- ✅ Responsive trên tất cả thiết bị

### Cho admin
- ✅ Dashboard tổng quan (thống kê doanh thu, đơn hàng)
- ✅ CRUD sản phẩm (upload multiple images local)
- ✅ Quản lý danh mục
- ✅ Quản lý đơn hàng (cập nhật trạng thái)
- ✅ Middleware bảo vệ route admin

## 🛠 Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs (password hashing)
- **File Upload**: File system local (/public/uploads)
- **Payment**: SePay API (QR code & webhook)
- **Environment**: .env.local configuration

## 🚀 Quick Start

### 1. Setup
```bash
npm install
```

### 2. Environment Variables (.env.local)
```env
MONGODB_URI=mongodb://localhost:27017/ecom-sepay
JWT_SECRET=your-super-secret-key
SEPAY_CLIENT_ID=your-sepay-id
SEPAY_API_KEY=your-sepay-key
SEPAY_WEBHOOK_SECRET=your-webhook-secret
SEPAY_API_URL=https://api.sepay.vn
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Seed Database
```bash
npm run seed
```
**Credentials:**
- Admin: `admin@sepay.local` / `admin123456`
- User: `user@sepay.local` / `user123456`

### 4. Run Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 📚 API Routes

**Auth**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/me`

**Products**
- `GET /api/products?page=1&category=...&search=...`
- `POST /api/products` (admin)
- `GET /api/products/:id`
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

**Categories**
- `GET /api/categories`
- `POST /api/categories` (admin)
- `GET /api/categories/:id`
- `PUT /api/categories/:id` (admin)
- `DELETE /api/categories/:id` (admin)

**Orders**
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/:id`
- `PUT /api/orders/:id` (admin)

**Payments**
- `POST /api/payments/create-qr`
- `POST /api/payments/webhook`

**Upload**
- `POST /api/upload/files`

## 🚀 Production Deployment (Ubuntu VPS)

### 1. Server Setup
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb-org
sudo systemctl start mongod && sudo systemctl enable mongod
```

### 2. App Setup
```bash
cd /var/www
git clone <repo-url> ecom-sepay
cd ecom-sepay
npm install
npm run build
cp .env.example .env.local
# Edit .env.local
```

### 3. PM2 Setup
```bash
npm install -g pm2
pm2 start npm --name "ecom-sepay" -- start
pm2 startup && pm2 save
```

### 4. Nginx Reverse Proxy
```bash
sudo apt-get install -y nginx

# /etc/nginx/sites-available/ecom-sepay
upstream backend {
  server localhost:3000;
}

server {
  listen 80;
  server_name your-domain.com;
  client_max_body_size 50M;

  location / {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  location /uploads {
    expires 1d;
  }
}

sudo ln -s /etc/nginx/sites-available/ecom-sepay /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```

### 5. SSL Certificate
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── orders/
│   │   ├── payments/
│   │   └── upload/
│   ├── admin/
│   │   ├── products/
│   │   ├── categories/
│   │   └── orders/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── products/
│   ├── cart/
│   └── page.tsx (Home)
├── lib/
│   ├── db/
│   │   └── mongodb.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Category.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   └── Payment.ts
│   └── utils/
│       ├── jwt.ts
│       ├── password.ts
│       ├── sepay.ts
│       ├── api.ts
│       ├── auth.ts
│       └── helpers.ts
└── components/
public/
└── uploads/ (Local file storage)
scripts/
└── seed.ts
```

## 🔐 Security Features

- ✅ Password hashing (bcryptjs)
- ✅ JWT token authentication
- ✅ Admin route protection
- ✅ Input validation
- ✅ SePay webhook verification
- ✅ Environment variable protection

## 📊 Database Models

- **User**: Authentication & profile
- **Category**: Product categories
- **Product**: Products with variants & custom fields
- **Order**: Customer orders
- **Payment**: Payment transactions

## 🛡️ Important Notes

1. **File Uploads**: Saved to `/public/uploads` locally
2. **Passwords**: Always hashed, never stored in plain text
3. **Tokens**: JWT tokens expire after 7 days
4. **SePay**: Webhooks must be verified with signature
5. **Admin Access**: Protected by JWT + isAdmin flag

## 📝 Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `SEPAY_CLIENT_ID` | SePay client ID |
| `SEPAY_API_KEY` | SePay API key |
| `SEPAY_WEBHOOK_SECRET` | SePay webhook secret |
| `NODE_ENV` | Environment (development/production) |

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
