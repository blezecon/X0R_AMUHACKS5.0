// app/api/user/stats/route.js
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/services/auth.js';
import { getUserStats } from '@/lib/services/decision-engine.js';

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
    
    // Get user stats
    const stats = await getUserStats(userId);
    
    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Stats error:', error);
    
    if (error.message === 'Invalid or expired token') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
