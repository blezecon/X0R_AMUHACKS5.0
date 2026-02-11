import { NextResponse } from 'next/server';
import { z } from 'zod';
import { registerUser } from '@/lib/services/auth.js';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  preferredProvider: z.enum(['openrouter', 'groq', 'anthropic']).optional(),
  apiKeys: z.object({
    openrouter: z.string().optional(),
    groq: z.string().optional(),
    anthropic: z.string().optional()
  }).default({})
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, apiKeys, preferredProvider } = registerSchema.parse(body);
    
    const result = await registerUser(name, email, password, apiKeys, preferredProvider);
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Registration error:', error);
    
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
