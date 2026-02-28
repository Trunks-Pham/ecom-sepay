import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Order from '@/lib/models/Order';
import Payment from '@/lib/models/Payment';
import { verifyWebhookSignature } from '@/lib/utils/sepay';
import { successResponse, errorResponse } from '@/lib/utils/api';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const signature = req.headers.get('x-sepay-signature');

    // Verify signature
    if (!signature || !verifyWebhookSignature(body, signature)) {
      console.warn('Invalid webhook signature');
      // Handle based on your security requirements
    }

    const { transaction_id, amount, description, status, order_id } = body;

    if (status === 'completed' || status === 'success') {
      // Find payment by SePay transaction ID or order reference
      const payment = await Payment.findOne({
        $or: [{ sepayTransactionId: transaction_id }, { orderId: order_id }],
      });

      if (payment) {
        // Update payment status
        payment.status = 'completed';
        payment.sepayTransactionId = transaction_id;
        await payment.save();

        // Update order status
        const order = await Order.findById(payment.orderId);
        if (order) {
          order.paymentStatus = 'completed';
          order.status = 'confirmed';
          order.sepayTransactionId = transaction_id;
          await order.save();
        }

        return NextResponse.json(successResponse(null, 'Payment processed successfully'));
      }
    } else if (status === 'failed' || status === 'cancelled') {
      const payment = await Payment.findOne({
        $or: [{ sepayTransactionId: transaction_id }, { orderId: order_id }],
      });

      if (payment) {
        payment.status = 'failed';
        await payment.save();

        const order = await Order.findById(payment.orderId);
        if (order) {
          order.paymentStatus = 'failed';
          order.status = 'cancelled';
          await order.save();
        }
      }
    }

    return NextResponse.json(successResponse(null, 'Webhook processed'));
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(errorResponse('Webhook processing failed'), { status: 500 });
  }
}
