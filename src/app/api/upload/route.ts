import { NextRequest, NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { authenticate, unauthorized } from '@/lib/utils/auth';
import { successResponse, errorResponse } from '@/lib/utils/api';

export const config = {
  api: {
    bodyParser: false,
  },
};

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    const payload = await authenticate(req);
    if (!payload) {
      return unauthorized();
    }

    // For now, return a placeholder response
    // Full multipart handling requires custom implementation
    return NextResponse.json(
      errorResponse('File upload endpoint - Please use form data with files field'),
      { status: 400 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(errorResponse('Failed to upload file'), { status: 500 });
  }
}
