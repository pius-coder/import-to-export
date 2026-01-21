/**
 * Profile Service
 * Handles user profile management
 */

import { PrismaClient, users } from "@/prisma";
import { BaseService } from "./base.service";

export class ProfileService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<users | null> {
    try {
      return await this.prisma.users.findUnique({
        where: { id: userId },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: Partial<{
      nom: string;
      prenom: string;
      telephone: string;
      pays: string;
      adresse: string;
    }>
  ): Promise<users> {
    try {
      return await this.prisma.users.update({
        where: { id: userId },
        data: {
          ...data,
          updated_at: new Date(),
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<{
    nombre_reservations: number;
    nombre_transports: number;
    nombre_devis: number;
    date_inscription: Date | null;
    date_derniere_connexion: Date | null;
  }> {
    try {
      const [
        nombre_reservations,
        nombre_transports,
        nombre_devis,
        user,
      ] = await Promise.all([
        this.prisma.reservations.count({
          where: { user_id: userId },
        }),
        this.prisma.transports.count({
          where: { user_id: userId },
        }),
        this.prisma.devis.count({
          where: { user_id: userId },
        }),
        this.prisma.users.findUnique({
          where: { id: userId },
          select: {
            date_inscription: true,
            date_derniere_connexion: true,
          },
        }),
      ]);

      return {
        nombre_reservations,
        nombre_transports,
        nombre_devis,
        date_inscription: user?.date_inscription || null,
        date_derniere_connexion: user?.date_derniere_connexion || null,
      };
    } catch (error) {
      this.handleError(error);
    }
  }
}
