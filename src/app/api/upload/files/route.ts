import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';
import { authenticate, unauthorized } from '@/lib/utils/auth';
import { successResponse, errorResponse } from '@/lib/utils/api';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
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

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(errorResponse('No files provided'), { status: 400 });
    }

    const uploadedFiles: { filename: string; url: string }[] = [];

    for (const file of files) {
      if (!file) continue;

      // Generate unique filename
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const extension = path.extname(file.name);
      const filename = `${timestamp}-${random}${extension}`;
      const filepath = path.join(UPLOAD_DIR, filename);

      // Read file buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Save file
      await writeFile(filepath, buffer);

      uploadedFiles.push({
        filename,
        url: `/uploads/${filename}`,
      });
    }

    return NextResponse.json(
      successResponse(uploadedFiles, 'Files uploaded successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(errorResponse('Failed to upload files'), { status: 500 });
  }
}
