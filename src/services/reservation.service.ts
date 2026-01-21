/**
 * Reservation Service
 * Handles all reservation-related business logic
 */

import { PrismaClient, reservations, reservation_statut } from "@/prisma";
import { v4 as uuidv4 } from "uuid";
import { BaseService } from "./base.service";

export class ReservationService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Get reservation by ID
   */
  async getReservationById(id: string): Promise<reservations | null> {
    try {
      return await this.prisma.reservations.findUnique({
        where: { id },
        include: {
          users: true,
          produits: true,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get reservation by number
   */
  async getReservationByNumber(
    numeroReservation: string
  ): Promise<reservations | null> {
    try {
      return await this.prisma.reservations.findUnique({
        where: { numero_reservation: numeroReservation },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Create new reservation
   */
  async createReservation(data: {
    user_id: string;
    produit_id: string;
    quantite: number;
    prix_unitaire: number;
    notes?: string;
  }): Promise<reservations> {
    try {
      this.validateRequired(data, [
        "user_id",
        "produit_id",
        "quantite",
        "prix_unitaire",
      ]);

      // Generate reservation number
      const numeroReservation = `RES-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

      const prixTotal = data.quantite * data.prix_unitaire;

      return await this.prisma.reservations.create({
        data: {
          id: uuidv4(),
          numero_reservation: numeroReservation,
          user_id: data.user_id,
          produit_id: data.produit_id,
          quantite: data.quantite,
          prix_unitaire: parseFloat(data.prix_unitaire.toString()),
          prix_total: parseFloat(prixTotal.toString()),
          notes: data.notes,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Update reservation status
   */
  async updateReservationStatus(
    id: string,
    statut: reservation_statut
  ): Promise<reservations> {
    try {
      return await this.prisma.reservations.update({
        where: { id },
        data: { statut },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Confirm reservation
   */
  async confirmReservation(id: string): Promise<reservations> {
    try {
      return await this.prisma.reservations.update({
        where: { id },
        data: {
          statut: "confirmee" as reservation_statut,
          date_confirmation: new Date(),
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Cancel reservation
   */
  async cancelReservation(id: string): Promise<reservations> {
    try {
      return await this.prisma.reservations.update({
        where: { id },
        data: {
          statut: "annulee" as reservation_statut,
          date_annulation: new Date(),
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get user reservations with pagination
   */
  async getUserReservations(
    userId: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{ reservations: reservations[]; total: number }> {
    try {
      const [reservations, total] = await Promise.all([
        this.prisma.reservations.findMany({
          where: { user_id: userId },
          skip,
          take,
          orderBy: { created_at: "desc" },
          include: { produits: true },
        }),
        this.prisma.reservations.count({
          where: { user_id: userId },
        }),
      ]);

      return { reservations, total };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get pending reservations
   */
  async getPendingReservations(
    skip: number = 0,
    take: number = 10
  ): Promise<{ reservations: reservations[]; total: number }> {
    try {
      const [reservations, total] = await Promise.all([
        this.prisma.reservations.findMany({
          where: { statut: "en_attente" as reservation_statut },
          skip,
          take,
          orderBy: { created_at: "asc" },
          include: { users: true, produits: true },
        }),
        this.prisma.reservations.count({
          where: { statut: "en_attente" as reservation_statut },
        }),
      ]);

      return { reservations, total };
    } catch (error) {
      this.handleError(error);
    }
  }
}
