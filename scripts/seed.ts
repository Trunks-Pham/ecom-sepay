import mongoose from 'mongoose';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import Category from '@/lib/models/Category';
import Product from '@/lib/models/Product';
import { hashPassword } from '@/lib/utils/password';
import { generateSlug } from '@/lib/utils/helpers';

async function seed() {
  try {
    console.log('🌱 Bắt đầu seeding dữ liệu...');
    
    await connectDB();
    console.log('✅ Kết nối MongoDB thành công');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️ Xóa dữ liệu cũ');

    // Create admin user
    const adminPassword = await hashPassword('admin123456');
    const admin = await User.create({
      email: 'admin@sepay.local',
      password: adminPassword,
      fullName: 'Admin EcomSePay',
      phone: '0901234567',
      isAdmin: true,
      address: '123 Đường Lê Lợi',
      city: 'Hà Nội',
      country: 'Vietnam',
      zipCode: '100000',
    });
    console.log('✅ Tạo admin user:', admin.email);

    // Create test user
    const userPassword = await hashPassword('user123456');
    const user = await User.create({
      email: 'user@sepay.local',
      password: userPassword,
      fullName: 'Nguyễn Văn A',
      phone: '0909876543',
      isAdmin: false,
      address: '456 Đường Tôn Đức Thắng',
      city: 'Hồ Chí Minh',
      country: 'Vietnam',
      zipCode: '700000',
    });
    console.log('✅ Tạo test user:', user.email);

    // Create categories
    const categories = await Category.insertMany([
      {
        name: 'Thời trang',
        slug: 'thoi-trang',
        description: 'Quần áo, giày dép, phụ kiện thời trang',
        icon: '👕',
        order: 1,
      },
      {
        name: 'Hoa tươi',
        slug: 'hoa-tuoi',
        description: 'Hoa tươi tự nhiên, bó hoa, lẵng hoa',
        icon: '🌹',
        order: 2,
      },
      {
        name: 'Đồ công nghệ',
        slug: 'do-cong-nghe',
        description: 'Điện thoại, laptop, phụ kiện công nghệ custom',
        icon: '📱',
        order: 3,
      },
    ]);
    console.log('✅ Tạo', categories.length, 'danh mục');

    // Create products
    const products = [
      // Fashion products
      {
        name: 'T-Shirt Cotton Cao Cấp',
        slug: 't-shirt-cotton-cao-cap',
        description: 'Áo thun cotton 100%, thoáng mát, bền lâu. Phù hợp cho mọi mùa.',
        category: categories[0]._id,
        price: 199000,
        comparePrice: 299000,
        stock: 50,
        thumbnail: '/uploads/placeholder.jpg',
        images: ['/uploads/placeholder.jpg'],
        variants: [
          {
            name: 'Size',
            options: ['S', 'M', 'L', 'XL', 'XXL'],
          },
          {
            name: 'Màu',
            options: ['Trắng', 'Đen', 'Xanh', 'Đỏ'],
          },
        ],
        customFields: [],
        sku: 'TSHIRT-001',
        isActive: true,
        isFeatured: true,
        ratings: 4.5,
        reviews: 128,
      },
      {
        name: 'Quần Jeans Nam Form Chuẩn',
        slug: 'quan-jeans-nam-form-chuan',
        description: 'Quần jeans nam chất lượng cao, dáng vừa vặn, êm ái.',
        category: categories[0]._id,
        price: 399000,
        comparePrice: 599000,
        stock: 30,
        thumbnail: '/uploads/placeholder.jpg',
        images: ['/uploads/placeholder.jpg'],
        variants: [
          {
            name: 'Size',
            options: ['28', '30', '32', '34', '36'],
          },
          {
            name: 'Độ sáng',
            options: ['Đậm', 'Sáng', 'Xanh nhạt'],
          },
        ],
        customFields: [],
        sku: 'JEANS-001',
        isActive: true,
        isFeatured: true,
        ratings: 4.8,
        reviews: 205,
      },

      // Flower products
      {
        name: 'Bó Hoa Hồng Đỏ 24 Bông',
        slug: 'bo-hoa-hong-do-24-bong',
        description: 'Bó 24 bông hồng đỏ tươi, đẹp, thích hợp tặng người yêu.',
        category: categories[1]._id,
        price: 599000,
        comparePrice: 799000,
        stock: 20,
        thumbnail: '/uploads/placeholder.jpg',
        images: ['/uploads/placeholder.jpg'],
        variants: [
          {
            name: 'Kiểu gói',
            options: ['Giấy trắng', 'Giấy hồng', 'Túi lưới'],
          },
        ],
        customFields: [
          {
            fieldName: 'Lời nhắn',
            fieldType: 'text',
            required: false,
          },
        ],
        sku: 'FLOWER-001',
        weight: 1.5,
        isActive: true,
        isFeatured: true,
        ratings: 4.9,
        reviews: 342,
      },
      {
        name: 'Lẵng Hoa Tươi Mix Ngàn Đơm',
        slug: 'lang-hoa-tuoi-mix-ngan-dom',
        description: 'Lẵng hoa tươi mix đầy đủ, rất thích hợp chúc mừng.',
        category: categories[1]._id,
        price: 1299000,
        stock: 10,
        thumbnail: '/uploads/placeholder.jpg',
        images: ['/uploads/placeholder.jpg'],
        variants: [],
        customFields: [
          {
            fieldName: 'Lời chúc tên người nhận',
            fieldType: 'text',
            required: false,
          },
        ],
        sku: 'FLOWER-002',
        weight: 3.0,
        isActive: true,
        isFeatured: false,
        ratings: 4.7,
        reviews: 156,
      },

      // Tech products
      {
        name: 'Ốp Lưng iPhone Custom Tên',
        slug: 'op-lung-iphone-custom-ten',
        description: 'Ốp lưng iPhone chất liệu cao cấp, có thể in tên, hình ảnh tùy chỉnh.',
        category: categories[2]._id,
        price: 149000,
        comparePrice: 199000,
        stock: 100,
        thumbnail: '/uploads/placeholder.jpg',
        images: ['/uploads/placeholder.jpg'],
        variants: [
          {
            name: 'Model iPhone',
            options: ['iPhone 14', 'iPhone 14 Pro', 'iPhone 15', 'iPhone 15 Pro'],
          },
          {
            name: 'Màu nền',
            options: ['Trắng', 'Đen', 'Xanh'],
          },
        ],
        customFields: [
          {
            fieldName: 'Tên hoặc hình ảnh',
            fieldType: 'text',
            required: true,
          },
        ],
        sku: 'TECH-001',
        isActive: true,
        isFeatured: true,
        ratings: 4.6,
        reviews: 89,
      },
      {
        name: 'Dán Decal Laptop Custom',
        slug: 'dan-decal-laptop-custom',
        description: 'Dán decal laptop chất lượng cao, độ bền lâu, thiết kế custom theo ý.',
        category: categories[2]._id,
        price: 79000,
        stock: 200,
        thumbnail: '/uploads/placeholder.jpg',
        images: ['/uploads/placeholder.jpg'],
        variants: [
          {
            name: 'Kích thước',
            options: ['13 inch', '14 inch', '15 inch', '16 inch'],
          },
        ],
        customFields: [
          {
            fieldName: 'Thiết kế (link hình hoặc mô tả)',
            fieldType: 'text',
            required: true,
          },
        ],
        sku: 'TECH-002',
        isActive: true,
        isFeatured: false,
        ratings: 4.4,
        reviews: 67,
      },
    ];

    await Product.insertMany(products);
    console.log('✅ Tạo', products.length, 'sản phẩm');

    console.log('\n🎉 Seeding hoàn tất!');
    console.log('\n📝 Thông tin đăng nhập:');
    console.log('Admin:');
    console.log('  Email:', admin.email);
    console.log('  Password: admin123456');
    console.log('\nUser:');
    console.log('  Email:', user.email);
    console.log('  Password: user123456');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi seed dữ liệu:', error);
    process.exit(1);
  }
}

seed();
