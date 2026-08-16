import { NextResponse } from 'next/server';
import { generateGeographicProfile } from '../../../lib/geo/decayModel';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { anchors, options } = body;

    if (!anchors || !Array.isArray(anchors)) {
      return NextResponse.json({ error: 'Anchors array is required' }, { status: 400 });
    }

    const result = generateGeographicProfile(anchors, options || { bufferMeters: 300, decayExponent: 1.5 });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error generating probability model' }, { status: 500 });
  }
}
