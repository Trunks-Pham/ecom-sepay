import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { authenticate, unauthorized } from '@/lib/utils/auth';
import { successResponse, errorResponse } from '@/lib/utils/api';

export async function GET(req: NextRequest) {
  try {
    const payload = await authenticate(req);
    if (!payload) {
      return unauthorized();
    }

    await connectDB();

    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json(errorResponse('User not found'), { status: 404 });
    }

    return NextResponse.json(
      successResponse({
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          avatar: user.avatar,
          isAdmin: user.isAdmin,
          address: user.address,
          city: user.city,
          country: user.country,
          zipCode: user.zipCode,
        },
      })
    );
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(errorResponse('Failed to fetch profile'), { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const payload = await authenticate(req);
    if (!payload) {
      return unauthorized();
    }

    await connectDB();

    const body = await req.json();
    const { fullName, phone, address, city, country, zipCode } = body;

    const user = await User.findByIdAndUpdate(
      payload.userId,
      {
        fullName: fullName || undefined,
        phone: phone || undefined,
        address: address || undefined,
        city: city || undefined,
        country: country || undefined,
        zipCode: zipCode || undefined,
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(errorResponse('User not found'), { status: 404 });
    }

    return NextResponse.json(successResponse(user, 'Profile updated successfully'));
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(errorResponse('Failed to update profile'), { status: 500 });
  }
}
