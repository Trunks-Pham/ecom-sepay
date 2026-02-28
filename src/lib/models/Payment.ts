import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  method: 'sepay' | 'cash';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  sepayTransactionId?: string;
  sepayQrCode?: string;
  sepayResponse?: Record<string, any>;
  refundAmount?: number;
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'VND',
    },
    method: {
      type: String,
      enum: ['sepay', 'cash'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    sepayTransactionId: String,
    sepayQrCode: String,
    sepayResponse: mongoose.Schema.Types.Mixed,
    refundAmount: Number,
    refundReason: String,
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment;
