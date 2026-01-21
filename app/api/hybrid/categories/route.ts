import { CategoryService, getPrismaClient } from '@/services';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const prisma = getPrismaClient();
    const categoryService = new CategoryService(prisma);

    const categories = await categoryService.getAllCategories();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
