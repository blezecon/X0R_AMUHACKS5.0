import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  verifyToken,
  completeOnboarding,
  getUserById,
  getDecryptedApiKey
} from '@/lib/services/auth.js';

  const updateSchema = z.object({
    provider: z.enum(['openrouter', 'groq', 'anthropic']).optional(),
    apiKey: z.string().min(3).optional(),
    name: z.string().min(2).optional(),
    profilePhoto: z.string().optional()
  });

function extractToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  const [, token] = authHeader.split(' ');
  return token;
}

export async function GET(request) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const user = await getUserById(decoded.userId);
    const preferredProvider = user.preferredProvider || 'openrouter';
    const query = request.nextUrl.searchParams;
    const reveal = query.get('reveal') === 'true';
    const requestedProvider = query.get('provider') || preferredProvider;

    const hasApiKey = Boolean(user.encryptedApiKeys?.get(requestedProvider));
    const payload = {
      preferredProvider,
      requestedProvider,
      hasApiKey,
      name: user.name,
      profilePhoto: user.profilePhoto
    };

    if (reveal && hasApiKey) {
      payload.apiKey = await getDecryptedApiKey(decoded.userId, requestedProvider);
    }

    return NextResponse.json({ success: true, data: payload });
  } catch (error) {
    console.error('Provider settings error:', error);
    if (error?.name === 'JsonWebTokenError' || error?.name === 'TokenExpiredError') {
      return NextResponse.json({ success: false, error: 'Session expired' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PATCH(request) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const body = await request.json();
    const payload = updateSchema.parse(body);

    if (!payload.provider && !payload.apiKey) {
      return NextResponse.json(
        { success: false, error: 'Provide at least a provider or API key to update' },
        { status: 400 }
      );
    }

    const result = await completeOnboarding(decoded.userId, payload);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Provider settings update error:', error);
    if (error?.name === 'JsonWebTokenError' || error?.name === 'TokenExpiredError') {
      return NextResponse.json({ success: false, error: 'Session expired' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
