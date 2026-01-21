/**
 * Accompagnement Service
 * Handles accompaniment/consulting services
 */

import { PrismaClient, devis_type, devis_statut } from "@/prisma";
import { v4 as uuidv4 } from "uuid";
import { BaseService } from "./base.service";

interface AccompagnementFormule {
  id: string;
  nom: string;
  description: string;
  services_inclus: string[];
  prix: number;
  devise: string;
}

export class AccompagnementService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Get all accompaniment formulas
   */
  async getFormules(): Promise<AccompagnementFormule[]> {
    try {
      // Predefined formulas
      return [
        {
          id: "form-1",
          nom: "Basic",
          description: "Formule de base pour les débutants",
          services_inclus: [
            "Consultation initiale",
            "Aide à la sélection de produits",
            "Support par email",
          ],
          prix: 500,
          devise: "USD",
        },
        {
          id: "form-2",
          nom: "Standard",
          description: "Formule intermédiaire pour les entreprises",
          services_inclus: [
            "Consultation initiale",
            "Aide à la sélection de produits",
            "Assistance transport",
            "Support par téléphone",
            "Suivi mensuel",
          ],
          prix: 1500,
          devise: "USD",
        },
        {
          id: "form-3",
          nom: "Premium",
          description: "Formule complète avec support dédié",
          services_inclus: [
            "Consultation initiale",
            "Aide à la sélection de produits",
            "Assistance transport complète",
            "Support 24/7",
            "Manager dédié",
            "Suivi hebdomadaire",
            "Assistance douanière",
          ],
          prix: 5000,
          devise: "USD",
        },
      ];
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Request accompaniment service
   */
  async requestAccompagnement(data: {
    user_id: string;
    formule_id: string;
    description_projet: string;
    budget_estime: number;
  }): Promise<{
    id: string;
    numero_demande: string;
    statut: string;
  }> {
    try {
      this.validateRequired(data, [
        "user_id",
        "formule_id",
        "description_projet",
        "budget_estime",
      ]);

      const numeroDemande = `ACCOM-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

      // Create devis linked to accompaniment
      const devis = await this.prisma.devis.create({
        data: {
          id: uuidv4(),
          numero_devis: numeroDemande,
          user_id: data.user_id,
          type_service: devis_type.accompagnement,
          nom: "", // Will be filled from user profile
          email: "", // Will be filled from user profile
          telephone: "", // Will be filled from user profile
          pays: "", // Will be filled from user profile
          details: data.description_projet,
          statut: devis_statut.en_attente,
        },
      });

      return {
        id: devis.id,
        numero_demande: numeroDemande,
        statut: "en_attente",
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get user accompaniment requests
   */
  async getUserAccompagnement(
    userId: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{ demandes: unknown[]; total: number }> {
    try {
      const [demandes, total] = await Promise.all([
        this.prisma.devis.findMany({
          where: {
            user_id: userId,
            type_service: "accompagnement",
          },
          skip,
          take,
          orderBy: { created_at: "desc" },
        }),
        this.prisma.devis.count({
          where: {
            user_id: userId,
            type_service: "accompagnement",
          },
        }),
      ]);

      return { demandes, total };
    } catch (error) {
      this.handleError(error);
    }
  }
}
