import { AccompagnementService, getPrismaClient } from '@/services';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const prisma = getPrismaClient();
    const accompagnementService = new AccompagnementService(prisma);

    const formules = await accompagnementService.getFormules();

    return NextResponse.json({
      success: true,
      data: formules,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
