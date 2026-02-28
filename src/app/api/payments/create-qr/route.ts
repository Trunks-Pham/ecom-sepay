import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Order from '@/lib/models/Order';
import Payment from '@/lib/models/Payment';
import { generateSepayQR } from '@/lib/utils/sepay';
import { successResponse, errorResponse } from '@/lib/utils/api';
import { authenticate, unauthorized } from '@/lib/utils/auth';

export async function POST(req: NextRequest) {
  try {
    const payload = await authenticate(req);
    if (!payload) {
      return unauthorized();
    }

    await connectDB();

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(errorResponse('Order ID is required'), { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(errorResponse('Order not found'), { status: 404 });
    }

    if (order.userId.toString() !== payload.userId && !payload.isAdmin) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    // Generate SePay QR
    try {
      const sepayResponse = await generateSepayQR(
        order.totalAmount,
        `Payment for order ${order.orderNumber}`,
        order.orderNumber
      );

      if (sepayResponse.code !== '00') {
        return NextResponse.json(errorResponse('Failed to generate QR code'), { status: 400 });
      }

      // Create payment
      const payment = await Payment.create({
        orderId,
        userId: payload.userId,
        amount: order.totalAmount,
        method: 'sepay',
        status: 'pending',
        sepayQrCode: sepayResponse.data?.qr,
        sepayResponse: sepayResponse,
      });

      return NextResponse.json(
        successResponse(
          {
            orderId,
            paymentId: payment._id,
            qrCode: sepayResponse.data?.qr,
            amount: order.totalAmount,
            description: `Payment for order ${order.orderNumber}`,
          },
          'QR code generated'
        )
      );
    } catch (error) {
      console.error('SePay error:', error);
      return NextResponse.json(errorResponse('Failed to create payment'), { status: 500 });
    }
  } catch (error) {
    console.error('Create payment error:', error);
    return NextResponse.json(errorResponse('Failed to process payment'), { status: 500 });
  }
}
