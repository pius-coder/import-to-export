/**
 * Category Service
 * Handles product categories
 */

import { PrismaClient, categories } from "@/prisma";
import { BaseService } from "./base.service";

export class CategoryService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Get all categories
   */
  async getAllCategories(): Promise<
    Array<{
      id: string;
      nom: string;
      slug: string;
      nombre_produits: number;
    }>
  > {
    try {
      const categories = await this.prisma.categories.findMany({
        where: { actif: true },
        orderBy: { ordre: "asc" },
        include: {
          _count: {
            select: { produits: true },
          },
        },
      });

      return categories.map((cat: unknown) => {
        const category = cat as { id: string; nom: string; slug: string; _count: { produits: number } };
        return {
          id: category.id,
          nom: category.nom,
          slug: category.slug,
          nombre_produits: category._count.produits,
        };
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<categories | null> {
    try {
      return await this.prisma.categories.findUnique({
        where: { id },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<categories | null> {
    try {
      return await this.prisma.categories.findUnique({
        where: { slug },
      });
    } catch (error) {
      this.handleError(error);
    }
  }
}
