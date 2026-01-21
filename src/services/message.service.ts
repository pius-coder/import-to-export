/**
 * Message Service
 * Handles conversations and messaging between users and admins
 */

import { PrismaClient, conversations, messages } from "@/prisma";
import { v4 as uuidv4 } from "uuid";
import { BaseService } from "./base.service";

export class MessageService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Get user conversations
   */
  async getUserConversations(
    userId: string,
    skip: number = 0,
    take: number = 20
  ): Promise<{ conversations: unknown[]; total: number }> {
    try {

      const [conversations, total] = await Promise.all([
        this.prisma.conversations.findMany({
          where: {
            OR: [{ user_id: userId }, { assigne_a: userId }],
          },
          skip,
          take,
          orderBy: { updated_at: "desc" },
          include: {
            messages: {
              take: 1,
              orderBy: { created_at: "desc" },
            },
          },
        } as any),
        this.prisma.conversations.count({
          where: {
            OR: [{ user_id: userId }, { assigne_a: userId }],
          },
        }),
      ]);

      // Format response
       
       
      const formattedConversations = (conversations as Array<Record<string, unknown>>).map((conv) => {
        const messageList = conv.messages as unknown[];
        const firstMsg = messageList?.[0] as { contenu: string } | undefined;
        return {
          id: conv.id,
          sujet: conv.sujet,
          dernier_message: firstMsg?.contenu || "",
          non_lu: (conv.non_lu as boolean) || false,
          date: conv.updated_at,
        };
      });

      return { conversations: formattedConversations, total };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get conversation details
   */
  async getConversation(conversationId: string): Promise<{
    id: string;
    sujet: string;
    messages: unknown[];
  } | null> {
    try {
      const conversation = await this.prisma.conversations.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { created_at: "asc" },
            include: {
              users: {
                select: { nom: true, prenom: true, email: true },
              },
            },
          },
        },
      });

      if (!conversation) {
        return null;
      }

      // Format messages
      const messageList = conversation.messages as unknown[];
      const formattedMessages = messageList.map((msg: unknown) => {
        const message = msg as { id: string; users: { nom: string; prenom: string }; contenu: string; created_at: Date; lu: boolean };
        return {
          id: message.id,
          expediteur: `${message.users.nom} ${message.users.prenom}`,
          contenu: message.contenu,
          date: message.created_at,
          lu: message.lu,
        };
      });

      return {
        id: conversation.id,
        sujet: conversation.sujet,
        messages: formattedMessages,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Create or get conversation
   */
  async createOrGetConversation(
    userId: string,
    sujet: string
  ): Promise<conversations> {
    try {
      // Try to find existing conversation
      const existing = await this.prisma.conversations.findFirst({
        where: {
          user_id: userId,
          sujet,
        },
      });

      if (existing) {
        return existing;
      }

      // Table may vary, use unknown for creation
      return await (this.prisma as any).conversations.create({
        data: {
          id: uuidv4(),
          user_id: userId,
          sujet,
          statut: "ouvert",
        },
      }) as conversations;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Send message in conversation
   */
  async sendMessage(data: {
    conversation_id: string;
    user_id: string;
    contenu: string;
  }): Promise<messages> {
    try {
      this.validateRequired(data, [
        "conversation_id",
        "user_id",
        "contenu",
      ]);

      const message = await this.prisma.messages.create({
        data: {
          id: uuidv4(),
          conversation_id: data.conversation_id,
          expediteur_id: data.user_id,
          contenu: data.contenu,
          lu: false,
        },
      });

      // Update conversation updated_at
      await this.prisma.conversations.update({
        where: { id: data.conversation_id },
        data: { updated_at: new Date() },
      });

      return message;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Mark message as read
   */
  async markMessageAsRead(messageId: string): Promise<messages> {
    try {
      return await this.prisma.messages.update({
        where: { id: messageId },
        data: { lu: true },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Mark conversation as read
   */
  async markConversationAsRead(conversationId: string): Promise<void> {
    try {
      // No non_lu field in conversations model, just update derniere_activite
      await this.prisma.conversations.update({
        where: { id: conversationId },
        data: { derniere_activite: new Date() },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get all conversations (admin)
   */
   
  async getAllConversations(
    skip: number = 0,
    take: number = 20
  ): Promise<{ conversations: any[]; total: number }> {
    try {
       
      const [conversations, total] = await Promise.all([
          this.prisma.conversations.findMany({
          skip,
          take,
          orderBy: { updated_at: "desc" },
          include: {
            users_conversations_user_idTousers: {
              select: { nom: true, prenom: true, email: true },
            },
            messages: {
              take: 1,
              orderBy: { created_at: "desc" },
            },
          },
        } as any),
        this.prisma.conversations.count(),
      ]);

      // Format response
      const formattedConversations = (conversations as any[]).map((conv: any) => ({
        id: conv.id,
        client: conv.users_conversations_user_idTousers,
        sujet: conv.sujet,
        dernier_message: conv.messages[0]?.contenu || "",
        date: conv.derniere_activite,
      }));

      return { conversations: formattedConversations, total };
    } catch (error) {
      this.handleError(error);
    }
  }
}
