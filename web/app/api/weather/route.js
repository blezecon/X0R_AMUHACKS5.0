import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyToken } from '@/lib/services/auth.js';
import { getWeather, getWeatherContext } from '@/lib/services/weather.js';

const weatherSchema = z.object({
  location: z.string().min(1)
});

export async function GET(request) {
  try {
    // Verify authentication (optional for weather)
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      verifyToken(token);
    }
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    
    const params = weatherSchema.parse({ location });
    
    // Get weather
    const weather = await getWeather(params.location);
    
    if (!weather) {
      return NextResponse.json(
        { success: false, error: 'Weather data not available' },
        { status: 503 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        ...weather,
        context: getWeatherContext(weather)
      }
    });
  } catch (error) {
    console.error('Weather error:', error);
    
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
