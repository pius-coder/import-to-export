/**
 * Devis Service
 * Handles quote requests and responses
 */

import { PrismaClient, devis, devis_statut, devis_type } from "@/prisma";
import { v4 as uuidv4 } from "uuid";
import { BaseService } from "./base.service";

interface CreateDevisRequest {
  type_service: "achat" | "transport" | "accompagnement";
  nom: string;
  email: string;
  telephone: string;
  pays: string;
  details: string;
  user_id?: string;
}

export class DevisService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Create a new quote request
   */
  async createDevis(data: CreateDevisRequest): Promise<{
    id: string;
    numero_devis: string;
    date_creation: Date;
  }> {
    try {
      this.validateRequired(
        data as unknown as Record<string, unknown>,
        [
          "type_service",
          "nom",
          "email",
          "telephone",
          "pays",
          "details",
        ]
      );

      const numeroDevis = `DEVIS-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

      const devis = await this.prisma.devis.create({
        data: {
          id: uuidv4(),
          numero_devis: numeroDevis,
          user_id: data.user_id,
          type_service: data.type_service as unknown as devis_type,
          nom: data.nom,
          email: data.email,
          telephone: data.telephone,
          pays: data.pays,
          details: data.details,
          statut: "en_attente" as devis_statut,
        },
      });

      return {
        id: devis.id,
        numero_devis: devis.numero_devis,
        date_creation: devis.created_at || new Date(),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get devis by ID
   */
  async getDevisById(id: string): Promise<devis | null> {
    try {
      return await this.prisma.devis.findUnique({
        where: { id },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get user devis
   */
  async getUserDevis(
    userId: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{ devis: devis[]; total: number }> {
    try {
      const [devis, total] = await Promise.all([
        this.prisma.devis.findMany({
          where: { user_id: userId },
          skip,
          take,
          orderBy: { created_at: "desc" },
        }),
        this.prisma.devis.count({
          where: { user_id: userId },
        }),
      ]);

      return { devis, total };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Respond to devis (admin)
   */
  async respondToDevis(
    id: string,
    data: {
      reponse: string;
      montant: number;
      devise: string;
      delai: string;
    }
  ): Promise<devis> {
    try {
      this.validateRequired(data, [
        "reponse",
        "montant",
        "devise",
        "delai",
      ]);

      return await this.prisma.devis.update({
        where: { id },
        data: {
          reponse: data.reponse,
          montant: parseFloat(data.montant.toString()),
          devise: data.devise,
          delai: data.delai,
          statut: "repondu" as devis_statut,
          date_reponse: new Date(),
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get all devis (admin)
   */
  async getAllDevis(
    filters?: {
      statut?: devis_statut;
      type_service?: string;
    },
    skip: number = 0,
    take: number = 20
  ): Promise<{ devis: devis[]; total: number }> {
    try {
      const whereFilters: Record<string, unknown> = {};
      if (filters?.statut) whereFilters.statut = filters.statut;
      if (filters?.type_service) whereFilters.type_service = filters.type_service;

      const [devis, total] = await Promise.all([
        this.prisma.devis.findMany({
          where: whereFilters,
          skip,
          take,
          orderBy: { created_at: "desc" },
        }),
        this.prisma.devis.count({
          where: whereFilters,
        }),
      ]);

      return { devis, total };
    } catch (error) {
      this.handleError(error);
    }
  }
}
