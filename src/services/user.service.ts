/**
 * User Service
 * Handles all user-related business logic
 */

import { PrismaClient, users, user_role, user_statut } from "@/prisma";
import { v4 as uuidv4 } from "uuid";
import { BaseService } from "./base.service";

export class UserService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<users | null> {
    try {
      return await this.prisma.users.findUnique({
        where: { email },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<users | null> {
    try {
      return await this.prisma.users.findUnique({
        where: { id },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Create new user
   */
  async createUser(data: {
    nom: string;
    prenom: string;
    email: string;
    mot_de_passe_hash: string;
    telephone?: string;
    pays?: string;
    adresse?: string;
    role?: user_role;
  }): Promise<users> {
    try {
      this.validateRequired(data, [
        "nom",
        "prenom",
        "email",
        "mot_de_passe_hash",
      ]);

      // Check if user already exists
      const existingUser = await this.getUserByEmail(data.email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      return await this.prisma.users.create({
        data: {
          id: uuidv4(),
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          mot_de_passe_hash: data.mot_de_passe_hash,
          telephone: data.telephone,
          pays: data.pays,
          adresse: data.adresse,
          role: data.role || ("client" as user_role),
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Update user
   */
  async updateUser(
    id: string,
    data: Partial<{
      nom: string;
      prenom: string;
      email: string;
      telephone: string;
      pays: string;
      adresse: string;
      statut: user_statut;
    }>
  ): Promise<users> {
    try {
      return await this.prisma.users.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<users> {
    try {
      return await this.prisma.users.delete({
        where: { id },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * List all users with pagination
   */
  async listUsers(skip: number = 0, take: number = 10): Promise<{
    users: users[];
    total: number;
  }> {
    try {
      const [users, total] = await Promise.all([
        this.prisma.users.findMany({
          skip,
          take,
          orderBy: { created_at: "desc" },
        }),
        this.prisma.users.count(),
      ]);

      return { users, total };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Update user last login
   */
  async updateLastLogin(id: string): Promise<users> {
    try {
      return await this.prisma.users.update({
        where: { id },
        data: { date_derniere_connexion: new Date() },
      });
    } catch (error) {
      this.handleError(error);
    }
  }
}
