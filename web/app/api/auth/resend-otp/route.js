import { NextResponse } from 'next/server';
import { z } from 'zod';
import { resendOTP } from '@/lib/services/auth.js';

const resendOTPSchema = z.object({
  email: z.string().email('Invalid email address')
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = resendOTPSchema.parse(body);
    
    const result = await resendOTP(email);
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    
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
