'use server';

import { MessageService, getPrismaClient } from '@/services';
import { getUserIdFromCookie } from './utils';

export async function createConversationAction(sujet: string) {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const prisma = getPrismaClient();
  const messageService = new MessageService(prisma);

  try {
    const result = await messageService.createOrGetConversation(userId, sujet);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function sendMessageAction(data: {
  conversation_id: string;
  contenu: string;
}) {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const prisma = getPrismaClient();
  const messageService = new MessageService(prisma);

  try {
    const result = await messageService.sendMessage({
      conversation_id: data.conversation_id,
      user_id: userId,
      contenu: data.contenu,
    });
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markMessageAsReadAction(messageId: string) {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const prisma = getPrismaClient();
  const messageService = new MessageService(prisma);

  try {
    const result = await messageService.markMessageAsRead(messageId);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
