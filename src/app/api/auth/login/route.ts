import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { comparePassword } from '@/lib/utils/password';
import { generateToken } from '@/lib/utils/jwt';
import { successResponse, errorResponse } from '@/lib/utils/api';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(errorResponse('Email and password are required'), {
        status: 400,
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(errorResponse('Invalid credentials'), { status: 401 });
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(errorResponse('Invalid credentials'), { status: 401 });
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      isAdmin: user.isAdmin,
    });

    return NextResponse.json(
      successResponse(
        {
          user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            isAdmin: user.isAdmin,
          },
          token,
        },
        'Login successful'
      )
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(errorResponse('Login failed'), { status: 500 });
  }
}
