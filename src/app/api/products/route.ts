import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import { successResponse, errorResponse, paginatedResponse } from '@/lib/utils/api';
import { authenticate, forbidden } from '@/lib/utils/auth';
import { generateSlug } from '@/lib/utils/helpers';

// GET all products with filters
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const featured = searchParams.get('featured');

    let query: Record<string, any> = { isActive: true };

    if (category) query.category = category;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    if (featured === 'true') query.isFeatured = true;

    const skip = (page - 1) * pageSize;
    const products = await Product.find(query).skip(skip).limit(pageSize).populate('category');
    const total = await Product.countDocuments(query);

    return NextResponse.json(paginatedResponse(products, total, page, pageSize));
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(errorResponse('Failed to fetch products'), { status: 500 });
  }
}

// POST create product (admin only)
export async function POST(req: NextRequest) {
  try {
    const payload = await authenticate(req);
    if (!payload || !payload.isAdmin) {
      return forbidden();
    }

    await connectDB();

    const body = await req.json();
    const {
      name,
      description,
      category,
      price,
      stock,
      images,
      thumbnail,
      variants,
      customFields,
      sku,
      weight,
      dimensions,
    } = body;

    if (!name || !description || !category || price === undefined || stock === undefined) {
      return NextResponse.json(
        errorResponse('Missing required fields: name, description, category, price, stock'),
        { status: 400 }
      );
    }

    const slug = generateSlug(name);

    const product = await Product.create({
      name,
      slug,
      description,
      category,
      price,
      stock,
      images: images || [],
      thumbnail,
      variants: variants || [],
      customFields: customFields || [],
      sku: sku || `SKU-${Date.now()}`,
      weight,
      dimensions,
      isActive: true,
    });

    await product.populate('category');
    return NextResponse.json(successResponse(product, 'Product created'), { status: 201 });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json(
      errorResponse(error.message || 'Failed to create product'),
      { status: 500 }
    );
  }
}
