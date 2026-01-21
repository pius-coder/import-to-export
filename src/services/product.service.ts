/**
 * Product Service
 * Handles all product-related business logic
 */

import { PrismaClient, produits, pays_enum } from "@/prisma";
import { v4 as uuidv4 } from "uuid";
import { BaseService } from "./base.service";

export class ProductService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<produits | null> {
    try {
      return await this.prisma.produits.findUnique({
        where: { id },
        include: { produits_images: true },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get product by slug
   */
  async getProductBySlug(slug: string): Promise<produits | null> {
    try {
      return await this.prisma.produits.findUnique({
        where: { slug },
        include: { produits_images: true },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Create new product
   */
  async createProduct(data: {
    categorie_id: string;
    nom: string;
    slug: string;
    description?: string;
    description_courte?: string;
    prix: number;
    devise?: string;
    pays_origine: string;
    quantite_minimum?: number;
    delai_livraison?: string;
    poids?: number;
    dimensions?: string;
    caracteristiques?: Record<string, unknown>;
  }): Promise<produits> {
    try {
      this.validateRequired(data, [
        "categorie_id",
        "nom",
        "slug",
        "prix",
        "pays_origine",
      ]);

      return await this.prisma.produits.create({
        data: {
          id: uuidv4(),
          categorie_id: data.categorie_id,
          nom: data.nom,
          slug: data.slug,
          description: data.description,
          description_courte: data.description_courte,
          prix: parseFloat(data.prix.toString()),
          devise: data.devise || "USD",
          pays_origine: data.pays_origine as pays_enum,
          quantite_minimum: data.quantite_minimum || 1,
          delai_livraison: data.delai_livraison,
          poids: data.poids ? parseFloat(data.poids.toString()) : null,
          dimensions: data.dimensions,
              caracteristiques: (data.caracteristiques || {}) as any,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Update product
   */
  async updateProduct(
    id: string,
    data: Partial<Omit<produits, "id">>
  ): Promise<produits> {
    try {
      return await this.prisma.produits.update({
        where: { id },
        data: data as Parameters<typeof this.prisma.produits.update>[0]["data"],
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string): Promise<produits> {
    try {
      return await this.prisma.produits.delete({
        where: { id },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * List products by category with pagination
   */
  async listProductsByCategory(
    categoryId: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{ products: produits[]; total: number }> {
    try {
      const [products, total] = await Promise.all([
        this.prisma.produits.findMany({
          where: { categorie_id: categoryId, disponible: true },
          skip,
          take,
          orderBy: { created_at: "desc" },
          include: { produits_images: true },
        }),
        this.prisma.produits.count({
          where: { categorie_id: categoryId, disponible: true },
        }),
      ]);

      return { products, total };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get all products with filters and pagination
   */
  async getAllProducts(params: {
    page?: number;
    limit?: number;
    categorie?: string;
    pays_origine?: string;
    prix_min?: number;
    prix_max?: number;
  }): Promise<{ products: produits[]; total: number }> {
    try {
      const {
        page = 1,
        limit = 20,
        categorie,
        pays_origine,
        prix_min,
        prix_max,
      } = params;

      const skip = (page - 1) * limit;

      const where: any = {
        disponible: true,
      };

      if (categorie) {
        where.categorie_id = categorie;
      }

      if (pays_origine) {
        where.pays_origine = pays_origine as pays_enum;
      }

      if (prix_min !== undefined || prix_max !== undefined) {
        where.prix = {};
        if (prix_min !== undefined) where.prix.gte = parseFloat(prix_min.toString());
        if (prix_max !== undefined) where.prix.lte = parseFloat(prix_max.toString());
      }

      const [products, total] = await Promise.all([
        this.prisma.produits.findMany({
          where,
          skip,
          take: limit,
          orderBy: { created_at: "desc" },
          include: { produits_images: true },
        }),
        this.prisma.produits.count({ where }),
      ]);

      return { products, total };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id: string): Promise<void> {
    try {
      await this.prisma.produits.update({
        where: { id },
        data: { nombre_vues: { increment: 1 } },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Search products
   */
  async searchProducts(
    query: string,
    skip: number = 0,
    take: number = 10
  ): Promise<{ products: produits[]; total: number }> {
    try {
      const [products, total] = await Promise.all([
        this.prisma.produits.findMany({
          where: {
            OR: [
              { nom: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
            disponible: true,
          },
          skip,
          take,
          orderBy: { created_at: "desc" },
        }),
        this.prisma.produits.count({
          where: {
            OR: [
              { nom: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
            disponible: true,
          },
        }),
      ]);

      return { products, total };
    } catch (error) {
      this.handleError(error);
    }
  }
}
