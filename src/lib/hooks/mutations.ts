'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as authActions from '@/app/actions/auth.actions';
import * as reservationActions from '@/app/actions/reservations.actions';
import * as transportActions from '@/app/actions/transport.actions';
import * as devisActions from '@/app/actions/devis.actions';
import * as messageActions from '@/app/actions/messages.actions';
import * as contactActions from '@/app/actions/contact.actions';
import * as profileActions from '@/app/actions/profile.actions';

// Auth
export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authActions.loginAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authActions.registerAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authActions.logoutAction,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

// Reservations
export const useCreateReservationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reservationActions.createReservationAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
};

export const useCancelReservationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reservationActions.cancelReservationAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
};

// Transport
export const useCreateTransportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transportActions.createTransportAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transports'] });
    },
  });
};

export const useCalculateTransportMutation = () => {
  return useMutation({
    mutationFn: transportActions.calculateTransportCostAction,
  });
};

// Devis
export const useCreateDevisMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: devisActions.createDevisAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devis'] });
    },
  });
};

// Messages
export const useCreateConversationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messageActions.createConversationAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messageActions.sendMessageAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useMarkMessageAsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messageActions.markMessageAsReadAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

// Contact
export const useSubmitContactMutation = () => {
  return useMutation({
    mutationFn: contactActions.submitContactAction,
  });
};

// Profile
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileActions.updateProfileAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
