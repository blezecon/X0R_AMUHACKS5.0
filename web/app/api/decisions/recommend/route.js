import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyToken, getUserById } from '@/lib/services/auth.js';
import { getRecommendation } from '@/lib/services/decision-engine.js';
import { getWeather, getWeatherContext } from '@/lib/services/weather.js';

const recommendSchema = z.object({
  type: z.enum(['meal', 'task', 'clothing']),
});

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const { userId } = verifyToken(token);
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const params = recommendSchema.parse({ type });
    
    // Get weather from user's stored location
    let weather = null;
    let weatherContext = 'neutral';
    const user = await getUserById(userId);
    const userLocation = user?.profile?.location || null;
    if (userLocation) {
      weather = await getWeather(userLocation);
      weatherContext = getWeatherContext(weather);
    }
    
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const context = {
      weather: weatherContext,
      time,
      location: userLocation
    };
    
    const recommendation = await getRecommendation(userId, params.type, context);
    
    return NextResponse.json({
      success: true,
      data: {
        ...recommendation,
        context: weather ? { weather, context: weatherContext } : null
      }
    });
  } catch (error) {
    console.error('Recommendation error:', error);

    if (error.message === 'Invalid or expired token') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (error?.name === 'MissingApiKeyError') {
      return NextResponse.json(
        { success: false, error: error.message, code: 'MISSING_API_KEY' },
        { status: 400 }
      );
    }

    if (error?.name === 'AIProviderError') {
      return NextResponse.json(
        { success: false, error: error.message, code: 'AI_PROVIDER_ERROR', provider: error.provider },
        { status: error.statusCode || 502 }
      );
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
