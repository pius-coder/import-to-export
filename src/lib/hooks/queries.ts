'use client';

import { useQuery } from '@tanstack/react-query';

// Products
export const useProducts = (page = 1, options = {}) => {
  return useQuery({
    queryKey: ['products', page],
    queryFn: async () => {
      const res = await fetch(`/api/hybrid/produits?page=${page}`);
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Categories
export const useCategories = (options = {}) => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch(`/api/hybrid/categories`);
      return res.json();
    },
    staleTime: 30 * 60 * 1000,
    ...options,
  });
};

// Reservations
export const useReservations = (page = 1, options = {}) => {
  return useQuery({
    queryKey: ['reservations', page],
    queryFn: async () => {
      const res = await fetch(`/api/hybrid/reservations?page=${page}`);
      return res.json();
    },
    ...options,
  });
};

// Transport
export const useTransports = (page = 1, options = {}) => {
  return useQuery({
    queryKey: ['transports', page],
    queryFn: async () => {
      const res = await fetch(`/api/hybrid/transport?page=${page}`);
      return res.json();
    },
    ...options,
  });
};

// Devis
export const useDevis = (page = 1, options = {}) => {
  return useQuery({
    queryKey: ['devis', page],
    queryFn: async () => {
      const res = await fetch(`/api/hybrid/devis?page=${page}`);
      return res.json();
    },
    ...options,
  });
};

// Conversations
export const useConversations = (page = 1, options = {}) => {
  return useQuery({
    queryKey: ['conversations', page],
    queryFn: async () => {
      const res = await fetch(`/api/hybrid/messages?page=${page}`);
      return res.json();
    },
    ...options,
  });
};

// Profile
export const useProfile = (options = {}) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await fetch(`/api/hybrid/profil`);
      return res.json();
    },
    ...options,
  });
};

// Formules
export const useFormules = (options = {}) => {
  return useQuery({
    queryKey: ['formules'],
    queryFn: async () => {
      const res = await fetch(`/api/hybrid/accompagnement/formules`);
      return res.json();
    },
    ...options,
  });
};
