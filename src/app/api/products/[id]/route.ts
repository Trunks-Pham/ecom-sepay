import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';
import { successResponse, errorResponse } from '@/lib/utils/api';
import { authenticate, forbidden, notFound } from '@/lib/utils/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const product = await Product.findById(params.id).populate('category');
    if (!product) {
      return notFound();
    }

    return NextResponse.json(successResponse(product));
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(errorResponse('Failed to fetch product'), { status: 500 });
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
    const product = await Product.findByIdAndUpdate(params.id, body, { new: true }).populate(
      'category'
    );

    if (!product) {
      return notFound();
    }

    return NextResponse.json(successResponse(product, 'Product updated'));
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(errorResponse('Failed to update product'), { status: 500 });
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

    const product = await Product.findByIdAndDelete(params.id);
    if (!product) {
      return notFound();
    }

    return NextResponse.json(successResponse(null, 'Product deleted'));
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(errorResponse('Failed to delete product'), { status: 500 });
  }
}
