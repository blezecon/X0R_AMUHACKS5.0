import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyOTP } from '@/lib/services/auth.js';

const verifyOTPSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits')
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, otp } = verifyOTPSchema.parse(body);
    
    const result = await verifyOTP(email, otp);
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    
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
