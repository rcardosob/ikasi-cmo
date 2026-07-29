import { NextRequest, NextResponse } from 'next/server';
import { mcpClient } from '@/lib/mcp/client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const propertyCode = searchParams.get('code');

  if (!propertyCode) {
    return NextResponse.json(
      { success: false, error: 'Se requiere el parámetro ?code=BIR-XXX' },
      { status: 400 }
    );
  }

  const result = await mcpClient.getPropertyDetail(propertyCode);
  return NextResponse.json(result);
}
