import { NextResponse } from 'next/server';
import { getMarketIndices } from '../../../../services/indicesService';

export async function GET() {
  const data = await getMarketIndices();
  return NextResponse.json(data);
}
