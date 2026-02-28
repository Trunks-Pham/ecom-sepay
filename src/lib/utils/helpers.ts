import { nextTick } from 'process';

export async function generateOrderNumber(): Promise<string> {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function formatCurrency(amount: number, currency = 'VND'): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function calculateTax(amount: number, taxRate = 0.1): number {
  return Math.round(amount * taxRate);
}

export function calculateShippingCost(totalAmount: number, weight?: number): number {
  // Free shipping if total > 500,000 VND
  if (totalAmount > 500000) return 0;
  // Base shipping 30,000 + 5,000 per kg
  const baseShipping = 30000;
  const perKgCost = (weight || 1) * 5000;
  return baseShipping + perKgCost;
}
