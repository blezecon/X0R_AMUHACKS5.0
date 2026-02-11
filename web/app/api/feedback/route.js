import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyToken } from '@/lib/services/auth.js';
import { recordFeedback } from '@/lib/services/decision-engine.js';

const feedbackSchema = z.object({
  decisionId: z.string(),
  chosenOption: z.string(),
  rating: z.number().int().min(1).max(5)
});

export async function POST(request) {
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
    
    // Parse body
    const body = await request.json();
    const { decisionId, chosenOption, rating } = feedbackSchema.parse(body);
    
    // Record feedback
    const result = await recordFeedback(userId, decisionId, chosenOption, rating);
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Feedback error:', error);
    
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
      { status: 400 }
    );
  }
}
