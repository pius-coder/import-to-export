import { ReservationService, getPrismaClient } from '@/services';
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '../../utils';

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    // Note: status filter is mentioned in docs but not supported by getUserReservations service method yet.
    // The service method getUserReservations only takes userId, skip, take.
    // We will stick to the service signature.

    const prisma = getPrismaClient();
    const reservationService = new ReservationService(prisma);

    const { reservations, total } = await reservationService.getUserReservations(
      userId,
      (page - 1) * limit,
      limit
    );

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: reservations,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
      },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
