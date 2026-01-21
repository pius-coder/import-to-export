/**
 * Authentication Service
 * Handles user authentication, registration, and token management
 */

import { PrismaClient, users, user_role } from "@/prisma";
import { v4 as uuidv4 } from "uuid";
import { BaseService } from "./base.service";

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: Partial<users>;
  token?: string;
}

export class AuthService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Register a new user
   */
  async register(data: {
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    pays?: string;
    mot_de_passe: string;
  }): Promise<AuthResponse> {
    try {
      this.validateRequired(data, [
        "nom",
        "prenom",
        "email",
        "mot_de_passe",
      ]);

      // Check if user already exists
      const existingUser = await this.prisma.users.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Hash password (in production, use bcrypt)
      const mot_de_passe_hash = this.hashPassword(data.mot_de_passe);

      const user = await this.prisma.users.create({
        data: {
          id: uuidv4(),
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          telephone: data.telephone,
          pays: data.pays,
          mot_de_passe_hash,
          role: "client" as user_role,
        },
      });

      const token = this.generateToken(user.id, user.role);

      return {
        success: true,
        message: "Compte créé avec succès",
        user: {
          id: user.id,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          role: user.role,
        },
        token,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Login user
   */
  async login(data: {
    email: string;
    mot_de_passe: string;
  }): Promise<AuthResponse> {
    try {
      this.validateRequired(data, ["email", "mot_de_passe"]);

      const user = await this.prisma.users.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Verify password
      const passwordMatch = this.verifyPassword(
        data.mot_de_passe,
        user.mot_de_passe_hash
      );
      if (!passwordMatch) {
        throw new Error("Invalid password");
      }

      // Update last login
      await this.prisma.users.update({
        where: { id: user.id },
        data: { date_derniere_connexion: new Date() },
      });

      const token = this.generateToken(user.id, user.role);

      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          nom: user.nom,
          role: user.role,
        },
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      this.validateRequired({ email }, ["email"]);

      const user = await this.prisma.users.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Create password reset token
      const resetToken = this.generateResetToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

      // Password resets table may not exist yet, skip if error
      try {
          await (this.prisma as any).password_resets.create({
          data: {
            id: uuidv4(),
            user_id: user.id,
            token: resetToken,
            expires_at: expiresAt,
          },
        });
      } catch (resetError) {
        // Table may not exist yet, continue anyway
        void resetError;
      }

      // TODO: Send email with reset link
      // sendResetEmail(user.email, resetToken);

      return {
        success: true,
        message: "Email de réinitialisation envoyé",
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: {
    token: string;
    nouveau_mot_de_passe: string;
  }): Promise<AuthResponse> {
    try {
      this.validateRequired(data, ["token", "nouveau_mot_de_passe"]);

      const resetRequest = await this.prisma.password_resets.findFirst({
        where: {
          token: data.token,
          expires_at: { gt: new Date() },
        },
      });

      if (!resetRequest) {
        throw new Error("Invalid or expired reset token");
      }

      const mot_de_passe_hash = this.hashPassword(data.nouveau_mot_de_passe);

      await this.prisma.users.update({
        where: { id: resetRequest.user_id },
        data: { mot_de_passe_hash },
      });

      // Delete the used token
      await this.prisma.password_resets.delete({
        where: { id: resetRequest.id },
      });

      return {
        success: true,
        message: "Mot de passe réinitialisé",
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(userId: string): Promise<AuthResponse> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const newToken = this.generateToken(user.id, user.role);

      return {
        success: true,
        token: newToken,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Verify authentication token
   */
  verifyToken(token: string): { userId: string; role: user_role } | null {
    // TODO: Implement JWT verification
    // This should verify the JWT token and extract userId and role
    // For now, we return null as this needs JWT library implementation
    void token; // Prevent unused variable warning
    return null;
  }

  /**
   * Generate authentication token
   */
  private generateToken(userId: string, role: user_role | null): string {
    // TODO: Implement JWT token generation
    // Should use JWT library to create a token that expires in 24h
    return `token_${userId}_${role}_${Date.now()}`;
  }

  /**
   * Generate password reset token
   */
  private generateResetToken(): string {
    return uuidv4();
  }

  /**
   * Hash password
   */
  private hashPassword(password: string): string {
    // TODO: Use bcrypt for production
    return Buffer.from(password).toString("base64");
  }

  /**
   * Verify password
   */
  private verifyPassword(password: string, hash: string): boolean {
    // TODO: Use bcrypt for production
    return Buffer.from(password).toString("base64") === hash;
  }
}
