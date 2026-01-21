/**
 * Transport Service
 * Handles transport requests, quotes, and tracking
 */

import { PrismaClient, transports, transport_statut } from "@/prisma";
import { v4 as uuidv4 } from "uuid";
import { BaseService } from "./base.service";

interface TransportCalculation {
  prix_maritime: number;
  prix_aerien: number;
  delai_maritime: string;
  delai_aerien: string;
  devise: string;
}

export class TransportService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Calculate transport costs
   */
  async calculateTransportCost(data: {
    pays_depart: string;
    pays_destination: string;
    type_marchandise: string;
    poids: number;
    volume: number;
  }): Promise<TransportCalculation> {
    try {
      this.validateRequired(data, [
        "pays_depart",
        "pays_destination",
        "type_marchandise",
        "poids",
        "volume",
      ]);

      // Simplified calculation logic
      // In production, this would query a pricing database
      const basePriceMaritime = 500;
      const basePriceAerien = 1500;
      const weightMultiplier = data.poids / 100;
      const volumeMultiplier = data.volume / 1000;

      const prix_maritime =
        basePriceMaritime * weightMultiplier * volumeMultiplier;
      const prix_aerien = basePriceAerien * weightMultiplier * volumeMultiplier;

      return {
        prix_maritime: parseFloat(prix_maritime.toFixed(2)),
        prix_aerien: parseFloat(prix_aerien.toFixed(2)),
        delai_maritime: "15-30 jours",
        delai_aerien: "3-5 jours",
        devise: "USD",
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Create transport request
   */
  async createTransport(data: {
    user_id: string;
    pays_depart: string;
    pays_destination: string;
    type_marchandise: string;
    poids: number;
    volume: number;
    mode_transport: "maritime" | "aerien";
    description?: string;
  }): Promise<transports> {
    try {
      this.validateRequired(data, [
        "user_id",
        "pays_depart",
        "pays_destination",
        "type_marchandise",
        "poids",
        "volume",
        "mode_transport",
      ]);

      const numeroTransport = `TRANS-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

      // Calculate estimated price
      const calculation = await this.calculateTransportCost({
        pays_depart: data.pays_depart,
        pays_destination: data.pays_destination,
        type_marchandise: data.type_marchandise,
        poids: data.poids,
        volume: data.volume,
      });

      const prix_estime =
        data.mode_transport === "maritime"
          ? calculation.prix_maritime
          : calculation.prix_aerien;

       
      return await this.prisma.transports.create({
        data: {
          id: uuidv4(),
          numero_transport: numeroTransport,
          user_id: data.user_id,
              pays_depart: data.pays_depart as any,
          pays_destination: data.pays_destination,
          type_marchandise: data.type_marchandise,
          poids: parseFloat(data.poids.toString()),
          volume: parseFloat(data.volume.toString()),
              mode_transport: data.mode_transport as any,
          description: data.description,
          prix_estime: parseFloat(prix_estime.toString()),
          statut: transport_statut.en_attente,
        },
      } as any);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get transport by ID
   */
  async getTransportById(id: string): Promise<transports | null> {
    try {
      return await this.prisma.transports.findUnique({
        where: { id },
        include: {
          transport_timeline: true,
          transport_documents: true,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get user transports
   */
  async getUserTransports(
    userId: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{ transports: transports[]; total: number }> {
    try {
      const [transports, total] = await Promise.all([
        this.prisma.transports.findMany({
          where: { user_id: userId },
          skip,
          take,
          orderBy: { created_at: "desc" },
        }),
        this.prisma.transports.count({
          where: { user_id: userId },
        }),
      ]);

      return { transports, total };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Update transport status
   */
  async updateTransportStatus(
    id: string,
    statut: transport_statut,
    description?: string
  ): Promise<transports> {
    try {
      const transport = await this.prisma.transports.update({
        where: { id },
        data: { statut },
      });

      // Add timeline entry
      if (description) {
         
        await (this.prisma as unknown as { transport_timeline: { create: (data: unknown) => Promise<unknown> } }).transport_timeline.create({
          data: {
            id: uuidv4(),
            transport_id: id,
            etape: statut,
            description,
          } as unknown,
        });
      }

      return transport;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Add transport document
   */
  async addTransportDocument(
    transportId: string,
    data: {
      nom: string;
      type: string;
      url: string;
    }
  ): Promise<{
    id: string;
    nom: string;
    url: string;
    type: string;
  }> {
    try {
      this.validateRequired(data, ["nom", "type", "url"]);

      const document = await this.prisma.transport_documents.create({
        data: {
          id: uuidv4(),
          transport_id: transportId,
          nom: data.nom,
          type: data.type,
          url: data.url,
        },
      });

      return {
        id: document.id,
        nom: document.nom,
        url: document.url,
        type: document.type || "",
      };
    } catch (error) {
      this.handleError(error);
    }
  }
}
