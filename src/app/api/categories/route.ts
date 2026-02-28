import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Category from '@/lib/models/Category';
import { successResponse, errorResponse } from '@/lib/utils/api';
import { authenticate, forbidden } from '@/lib/utils/auth';
import { generateSlug } from '@/lib/utils/helpers';

// GET all categories
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const categories = await Category.find().sort({ order: 1 });
    return NextResponse.json(successResponse(categories));
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(errorResponse('Failed to fetch categories'), { status: 500 });
  }
}

// POST create category (admin only)
export async function POST(req: NextRequest) {
  try {
    const payload = await authenticate(req);
    if (!payload || !payload.isAdmin) {
      return forbidden();
    }

    await connectDB();

    const { name, description, icon, order } = await req.json();

    if (!name) {
      return NextResponse.json(errorResponse('Category name is required'), { status: 400 });
    }

    const slug = generateSlug(name);

    const category = await Category.create({
      name,
      slug,
      description,
      icon,
      order: order || 0,
    });

    return NextResponse.json(successResponse(category, 'Category created'), { status: 201 });
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(errorResponse('Failed to create category'), { status: 500 });
  }
}
