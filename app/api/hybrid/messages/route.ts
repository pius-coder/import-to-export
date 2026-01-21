import { MessageService, getPrismaClient } from '@/services';
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

    const prisma = getPrismaClient();
    const messageService = new MessageService(prisma);

    const { conversations, total } = await messageService.getUserConversations(
      userId,
      (page - 1) * limit,
      limit
    );

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: conversations,
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
