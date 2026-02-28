import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Category from '@/lib/models/Category';
import { successResponse, errorResponse } from '@/lib/utils/api';
import { authenticate, forbidden, notFound } from '@/lib/utils/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const category = await Category.findById(params.id);
    if (!category) {
      return notFound();
    }

    return NextResponse.json(successResponse(category));
  } catch (error) {
    console.error('Get category error:', error);
    return NextResponse.json(errorResponse('Failed to fetch category'), { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await authenticate(req);
    if (!payload || !payload.isAdmin) {
      return forbidden();
    }

    await connectDB();

    const body = await req.json();
    const category = await Category.findByIdAndUpdate(params.id, body, { new: true });

    if (!category) {
      return notFound();
    }

    return NextResponse.json(successResponse(category, 'Category updated'));
  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json(errorResponse('Failed to update category'), { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await authenticate(req);
    if (!payload || !payload.isAdmin) {
      return forbidden();
    }

    await connectDB();

    const category = await Category.findByIdAndDelete(params.id);
    if (!category) {
      return notFound();
    }

    return NextResponse.json(successResponse(null, 'Category deleted'));
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(errorResponse('Failed to delete category'), { status: 500 });
  }
}
