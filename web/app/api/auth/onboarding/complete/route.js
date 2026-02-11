import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyToken, completeOnboarding } from '@/lib/services/auth.js';

const onboardingSchema = z.object({
  provider: z.enum(['openrouter', 'groq', 'anthropic']).optional(),
  apiKey: z.string().min(3, 'API key is too short').max(2048).optional(),
  profilePhoto: z.string().optional(),
  skip: z.boolean().optional()
});

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const body = await request.json();
    const payload = onboardingSchema.parse(body);

    const result = await completeOnboarding(decoded.userId, payload);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Onboarding error:', error);

    if (error?.name === 'JsonWebTokenError' || error?.name === 'TokenExpiredError') {
      return NextResponse.json({ success: false, error: 'Session expired' }, { status: 401 });
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid onboarding payload', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Something went wrong' },
      { status: 400 }
    );
  }
}
