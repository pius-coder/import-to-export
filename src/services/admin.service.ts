/**
 * Admin Service
 * Handles admin dashboard and statistics
 */

import { PrismaClient, transport_statut } from "@/prisma";
import { BaseService } from "./base.service";

interface DashboardStats {
  nouvelles_reservations: number;
  transports_en_cours: number;
  devis_en_attente: number;
  revenus_mois: number;
  nombre_clients: number;
}

export class AdminService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const currentMonth = new Date();
      currentMonth.setDate(1);

      const [
        nouvelles_reservations,
        transports_en_cours,
        devis_en_attente,
        nombre_clients,
      ] = await Promise.all([
        // Reservations created in the last 7 days
        this.prisma.reservations.count({
          where: {
            created_at: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),

        // Transports in progress
        this.prisma.transports.count({
          where: {
            statut: {
              in: ["en_attente", "marchandise_recue", "en_transit"] as transport_statut[],
            },
          },
        }),

        // Quotes pending response
        this.prisma.devis.count({
          where: {
            statut: "en_attente",
          },
        }),

        // Total clients
        this.prisma.users.count({
          where: {
            role: "client",
          },
        }),
      ]);

      // Calculate revenue for current month
      const transportsThisMonth = await this.prisma.transports.findMany({
        where: {
          created_at: {
            gte: currentMonth,
            lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
          },
        },
        select: { prix_estime: true },
      });

      const revenus_mois = transportsThisMonth.reduce(
        (sum, t) => sum + Number(t.prix_estime || 0),
        0
      );

      return {
        nouvelles_reservations,
        transports_en_cours,
        devis_en_attente,
        revenus_mois: parseFloat(revenus_mois.toFixed(2)),
        nombre_clients,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get admin statistics by date range
   */
  async getStatsDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<{
    total_reservations: number;
    total_transports: number;
    total_revenue: number;
    average_order_value: number;
  }> {
    try {
      const [reservations, transports] = await Promise.all([
        this.prisma.reservations.findMany({
          where: {
            created_at: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: { prix_total: true },
        }),
        this.prisma.transports.findMany({
          where: {
            created_at: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: { prix_estime: true },
        }),
      ]);

      const total_reservations = reservations.length;
      const total_transports = transports.length;
      const reservations_revenue = reservations.reduce(
        (sum, r) => sum + Number(r.prix_total || 0),
        0
      );
      const transports_revenue = transports.reduce(
        (sum, t) => sum + Number(t.prix_estime || 0),
        0
      );
      const total_revenue = reservations_revenue + transports_revenue;
      const total_items = total_reservations + total_transports;
      const average_order_value = total_items > 0 ? total_revenue / total_items : 0;

      return {
        total_reservations,
        total_transports,
        total_revenue: parseFloat(total_revenue.toFixed(2)),
        average_order_value: parseFloat(average_order_value.toFixed(2)),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get activity log
   */
  async getActivityLog(
    skip: number = 0,
    take: number = 50
  ): Promise<{ logs: unknown[]; total: number }> {
    try {
      const [logs, total] = await Promise.all([
        this.prisma.logs_activite.findMany({
          skip,
          take,
          orderBy: { created_at: "desc" },
          include: {
            users: {
              select: { nom: true, prenom: true, email: true },
            },
          },
        }),
        this.prisma.logs_activite.count(),
      ]);

      return { logs, total };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Log user activity
   */
  async logActivity(data: {
    user_id: string;
    type_activite: string;
    description?: string;
    entite_type?: string;
    entite_id?: string;
  }): Promise<void> {
    try {
      // Import v4 in the service when needed
      const { v4: uuidv4 } = await import("uuid");
      
      await this.prisma.logs_activite.create({
        data: {
          id: uuidv4(),
          user_id: data.user_id,
          type_activite: data.type_activite,
          description: data.description,
          entite_type: data.entite_type,
          entite_id: data.entite_id,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }
}
