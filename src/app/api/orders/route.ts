import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Order from '@/lib/models/Order';
import { successResponse, errorResponse, paginatedResponse } from '@/lib/utils/api';
import { authenticate, unauthorized } from '@/lib/utils/auth';
import { generateOrderNumber } from '@/lib/utils/helpers';

// GET user orders
export async function GET(req: NextRequest) {
  try {
    const payload = await authenticate(req);
    if (!payload) {
      return unauthorized();
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const isAdmin = payload.isAdmin;

    let query: any = {};
    if (!isAdmin) {
      query.userId = payload.userId;
    }

    const skip = (page - 1) * pageSize;
    const orders = await Order.find(query)
      .skip(skip)
      .limit(pageSize)
      .populate('userId')
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    return NextResponse.json(paginatedResponse(orders, total, page, pageSize));
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(errorResponse('Failed to fetch orders'), { status: 500 });
  }
}

// POST create order
export async function POST(req: NextRequest) {
  try {
    const payload = await authenticate(req);
    if (!payload) {
      return unauthorized();
    }

    await connectDB();

    const body = await req.json();
    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      totalAmount,
      notes,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(errorResponse('Order items are required'), { status: 400 });
    }

    const orderNumber = await generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      userId: payload.userId,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      totalAmount,
      notes,
      status: 'pending',
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'pending',
    });

    return NextResponse.json(successResponse(order, 'Order created'), { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(errorResponse('Failed to create order'), { status: 500 });
  }
}
