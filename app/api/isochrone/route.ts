import { NextResponse } from 'next/server';
import { calculateIsochrone } from '../../../lib/geo/isochroneClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { anchor, transportProfile, minutes, orsApiKey } = body;

    if (!anchor || !transportProfile || !minutes) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const result = await calculateIsochrone(anchor, transportProfile, minutes, orsApiKey);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error calculating isochrone' }, { status: 500 });
  }
}
