import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'selbstfahrervermietversicherung-online',
    timestamp: new Date().toISOString(),
  });
}

