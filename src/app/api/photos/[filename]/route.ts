// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await params;
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return new NextResponse('forbidden', { status: 403 });
    }
    const filePath = path.join(process.cwd(), 'public', 'product_photos', filename);
    if (!fs.existsSync(filePath)) {
      return new NextResponse('not found', { status: 404 });
    }
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';
    return new NextResponse(data, {
      headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=31536000, immutable' },
    });
  } catch (e) {
    return new NextResponse('error', { status: 500 });
  }
}
