import { NextResponse } from 'next/server';
import { trucks } from '@/data/trucks';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  let filteredTrucks = trucks;

  if (category) {
    filteredTrucks = trucks.filter(t => t.category === category);
  }

  return NextResponse.json({
    success: true,
    data: filteredTrucks,
    total: filteredTrucks.length
  });
}
