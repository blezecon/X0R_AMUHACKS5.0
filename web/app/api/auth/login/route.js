import { NextResponse } from 'next/server';
import { z } from 'zod';
import { loginUser } from '@/lib/services/auth.js';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);
    
    const result = await loginUser(email, password);
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 401 }
    );
  }
}
