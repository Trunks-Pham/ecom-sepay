import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { hashPassword, comparePassword } from '@/lib/utils/password';
import { generateToken } from '@/lib/utils/jwt';
import { successResponse, errorResponse } from '@/lib/utils/api';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password, fullName, phone } = await req.json();

    // Validation
    if (!email || !password || !fullName || !phone) {
      return NextResponse.json(errorResponse('Missing required fields'), { status: 400 });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(errorResponse('Email already exists'), { status: 409 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      phone,
      isAdmin: false,
    });

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
        'Registration successful'
      ),
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(errorResponse('Registration failed'), { status: 500 });
  }
}
