/**
 * Contact Service
 * Handles contact form submissions
 */

import { PrismaClient, contacts } from "@/prisma";
import { v4 as uuidv4 } from "uuid";
import { BaseService } from "./base.service";

export class ContactService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Submit contact form
   */
  async submitContact(data: {
    nom: string;
    email: string;
    telephone?: string;
    sujet: string;
    message: string;
    ip_address?: string;
  }): Promise<contacts> {
    try {
      this.validateRequired(data, [
        "nom",
        "email",
        "sujet",
        "message",
      ]);

      const contact = await this.prisma.contacts.create({
        data: {
          id: uuidv4(),
          nom: data.nom,
          email: data.email,
          telephone: data.telephone,
          sujet: data.sujet,
          message: data.message,
          ip_address: data.ip_address,
          traite: false,
        },
      });

      // TODO: Send notification email to admin
      // sendAdminNotification(contact);

      return contact;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get contact by ID
   */
  async getContactById(id: string): Promise<contacts | null> {
    try {
      return await this.prisma.contacts.findUnique({
        where: { id },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get all contacts (admin)
   */
  async getAllContacts(
    filters?: {
      traite?: boolean;
    },
    skip: number = 0,
    take: number = 20
  ): Promise<{ contacts: contacts[]; total: number }> {
    try {
      const [contacts, total] = await Promise.all([
        this.prisma.contacts.findMany({
          where: filters,
          skip,
          take,
          orderBy: { created_at: "desc" },
        }),
        this.prisma.contacts.count({
          where: filters,
        }),
      ]);

      return { contacts, total };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Mark contact as processed
   */
  async markAsProcessed(id: string, response: string, user_id: string): Promise<contacts> {
    try {
      return await this.prisma.contacts.update({
        where: { id },
        data: {
          traite: true,
          reponse: response,
          traite_par: user_id,
          date_traitement: new Date(),
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }
}
