import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyToken } from '@/lib/services/auth.js';
import { getRecommendation } from '@/lib/services/decision-engine.js';
import { getWeather, getWeatherContext } from '@/lib/services/weather.js';

const recommendSchema = z.object({
  type: z.enum(['meal', 'task']),
  location: z.string().optional()
});

export async function GET(request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const { userId } = verifyToken(token);
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    
    const params = recommendSchema.parse({ type, location });
    
    // Get weather if location provided
    let weather = null;
    let weatherContext = 'neutral';
    if (params.location) {
      weather = await getWeather(params.location);
      weatherContext = getWeatherContext(weather);
    }
    
    // Get current time
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Build context
    const context = {
      weather: weatherContext,
      time,
      location: params.location
    };
    
    // Get recommendation
    const recommendation = await getRecommendation(userId, params.type, context);
    
    return NextResponse.json({
      success: true,
      data: {
        ...recommendation,
        context: weather ? {
          weather,
          context: weatherContext
        } : null
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
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
