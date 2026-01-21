import { ProductService, getPrismaClient } from '@/services';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const categorie = searchParams.get('categorie') || undefined;
    const pays_origine = searchParams.get('pays_origine') || undefined;

    // Parse numeric filters if they exist
    const prix_min_param = searchParams.get('prix_min');
    const prix_max_param = searchParams.get('prix_max');
    const prix_min = prix_min_param ? parseFloat(prix_min_param) : undefined;
    const prix_max = prix_max_param ? parseFloat(prix_max_param) : undefined;

    const prisma = getPrismaClient();
    const productService = new ProductService(prisma);

    const { products, total } = await productService.getAllProducts({
      page,
      limit,
      categorie,
      pays_origine,
      prix_min,
      prix_max,
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: products,
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
