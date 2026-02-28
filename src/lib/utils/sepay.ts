import axios from 'axios';

interface SepayQRResponse {
  code: string;
  message: string;
  data?: {
    qr: string;
    qr_data: string;
    amount: number;
  };
}

const SEPAY_API_URL = process.env.SEPAY_API_URL || 'https://api.sepay.vn';
const SEPAY_CLIENT_ID = process.env.SEPAY_CLIENT_ID || '';
const SEPAY_API_KEY = process.env.SEPAY_API_KEY || '';
const SEPAY_WEBHOOK_SECRET = process.env.SEPAY_WEBHOOK_SECRET || '';

const sepayClient = axios.create({
  baseURL: SEPAY_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Client-Id': SEPAY_CLIENT_ID,
    'Api-Key': SEPAY_API_KEY,
  },
});

export async function generateSepayQR(
  amount: number,
  description: string,
  orderId: string
): Promise<SepayQRResponse> {
  try {
    const response = await sepayClient.post('/v1/qr/create', {
      amount,
      description: `${description} - Order #${orderId}`,
      addInfo: `Order ${orderId}`,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    });
    return response.data;
  } catch (error) {
    console.error('SePay QR generation error:', error);
    throw new Error('Failed to generate SePay QR code');
  }
}

export async function getTransactionDetails(transactionId: string) {
  try {
    const response = await sepayClient.get(`/v1/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error('SePay transaction details error:', error);
    throw new Error('Failed to get transaction details');
  }
}

export function verifyWebhookSignature(
  data: Record<string, any>,
  signature: string
): boolean {
  // Implement signature verification based on SePay documentation
  // This is a placeholder - adjust according to actual SePay spec
  try {
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha256', SEPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(data))
      .digest('hex');
    return hash === signature;
  } catch {
    return false;
  }
}

export { SEPAY_WEBHOOK_SECRET };
