/**
 * Base Service Class
 * Provides common functionality for all services
 */

import { PrismaClient } from "@/prisma/client";

export abstract class BaseService {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Handle service errors
   */
  protected handleError(error: unknown): never {
    console.error("Service Error:", error);
    const message = error instanceof Error ? error.message : "An error occurred while processing your request";
    throw new Error(message);
  }

  /**
   * Validate required fields
   */
  protected validateRequired(data: Record<string, unknown>, fields: string[]): void {
    const missingFields = fields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }
  }
}
