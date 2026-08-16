import { NextResponse } from 'next/server';
import { MARTA_DEL_CASTILLO_CASE } from '../../../../lib/seed/martaDelCastillo';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  const { caseId } = await params;

  if (caseId === MARTA_DEL_CASTILLO_CASE.id || caseId === 'marta-del-castillo') {
    return NextResponse.json(MARTA_DEL_CASTILLO_CASE);
  }

  return NextResponse.json(MARTA_DEL_CASTILLO_CASE);
}
