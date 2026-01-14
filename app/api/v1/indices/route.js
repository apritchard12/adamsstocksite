import { NextResponse } from 'next/server';
import { getMarketIndices } from '../../../../services/indicesService';

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
  const data = await getMarketIndices();
  return NextResponse.json(data);
}
