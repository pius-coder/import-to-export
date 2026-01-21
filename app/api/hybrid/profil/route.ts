import { ProfileService, getPrismaClient } from '@/services';
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

    const prisma = getPrismaClient();
    const profileService = new ProfileService(prisma);

    const profile = await profileService.getProfile(userId);

    if (!profile) {
        return NextResponse.json(
            { success: false, error: 'Profile not found' },
            { status: 404 }
        );
    }

    return NextResponse.json({
      success: true,
      data: {
          id: profile.id,
          nom: profile.nom,
          prenom: profile.prenom,
          email: profile.email,
          telephone: profile.telephone,
          pays: profile.pays,
          adresse: profile.adresse,
          date_inscription: profile.date_inscription
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
