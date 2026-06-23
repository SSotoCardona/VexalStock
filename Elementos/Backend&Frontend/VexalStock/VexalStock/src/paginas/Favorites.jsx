import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { getFavorites, getProducts, createFavorite, deleteFavorite } from '@/api/backendClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ProductGrid from '@/componentes/products/ProductGrid';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Favorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', user?.email],
    queryFn: () => getFavorites(user.email),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ['all-products'],
    queryFn: () => getProducts(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const favoriteProducts = allProducts.filter(p => favorites.some(f => f.product_id === p.id));
  const favoriteIds = favorites.map(f => f.product_id);

  const toggleFavorite = useMutation({
    mutationFn: async (productId) => {
      const existing = favorites.find(f => f.product_id === productId);
      if (existing) await deleteFavorite(existing.id);
      else await createFavorite({ user_email: user.email, product_id: productId });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <Heart className="w-6 h-6 text-primary" />
        <h1 className="font-heading text-2xl sm:text-3xl font-bold">Favoritos</h1>
        <span className="text-sm text-muted-foreground">({favoriteProducts.length})</span>
      </div>

      {!favoriteProducts.length ? (
        <div className="text-center py-20 space-y-3">
          <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto" />
          <p className="text-muted-foreground">No tienes favoritos aún</p>
          <p className="text-xs text-muted-foreground">Toca el corazón en cualquier producto para guardarlo</p>
        </div>
      ) : (
        <ProductGrid
          products={favoriteProducts}
          favoriteIds={favoriteIds}
          onToggleFavorite={(id) => toggleFavorite.mutate(id)}
        />
      )}
    </motion.div>
  );
}