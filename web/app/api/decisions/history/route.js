import { z } from 'zod';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/services/auth.js';
import { getUserHistory } from '@/lib/services/decision-engine.js';

const historySchema = z.object({
  limit: z.string().optional()
});

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const { userId } = verifyToken(token);

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const { limit } = historySchema.parse({ limit: limitParam || undefined });
    const parsedLimit = limit ? Math.min(Number(limit), 50) : 12;

    const history = await getUserHistory(userId, parsedLimit);
    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error('History error:', error);

    if (error.message === 'Invalid or expired token') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
