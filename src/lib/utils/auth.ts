import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromHeader, verifyToken } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  userId?: string;
  email?: string;
  isAdmin?: boolean;
}

export async function authenticate(req: NextRequest) {
  const token = extractTokenFromHeader(req.headers.get('authorization'));
  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  return payload;
}

export function unauthorized() {
  return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
}

export function notFound() {
  return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
}

export function badRequest(message: string) {
  return NextResponse.json({ success: false, message }, { status: 400 });
}
