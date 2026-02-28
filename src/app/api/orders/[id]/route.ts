import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Order from '@/lib/models/Order';
import { successResponse, errorResponse } from '@/lib/utils/api';
import { authenticate, unauthorized, forbidden, notFound } from '@/lib/utils/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await authenticate(req);
    if (!payload) {
      return unauthorized();
    }

    await connectDB();

    const order = await Order.findById(params.id).populate('userId').populate('items.productId');
    if (!order) {
      return notFound();
    }

    // Check if user owns this order or is admin
    const isOwner = order.userId._id.toString() === payload.userId;
    if (!isOwner && !payload.isAdmin) {
      return forbidden();
    }

    return NextResponse.json(successResponse(order));
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(errorResponse('Failed to fetch order'), { status: 500 });
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
    const { status, paymentStatus, trackingNumber } = body;

    const order = await Order.findByIdAndUpdate(
      params.id,
      {
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        trackingNumber: trackingNumber || undefined,
      },
      { new: true }
    );

    if (!order) {
      return notFound();
    }

    return NextResponse.json(successResponse(order, 'Order updated'));
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(errorResponse('Failed to update order'), { status: 500 });
  }
}
