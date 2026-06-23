import React, { useState, useMemo } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { getProducts, getFavorites, createFavorite, deleteFavorite } from '@/api/backendClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import FilterBar from '@/componentes/products/FilterBar';
import ProductGrid from '@/componentes/products/ProductGrid';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    search: '', category: 'all', size: 'all', gender: 'all', sort: '-created_date'
  });

  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts({ status: 'disponible' }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', user?.email],
    queryFn: () => getFavorites(user.email),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  // Limpiar queries al desmontar el componente
  React.useEffect(() => {
    return () => {
      // Cancel queries en progreso
      queryClient.cancelQueries({ queryKey: ['products'] });
      queryClient.cancelQueries({ queryKey: ['favorites'] });
    };
  }, [queryClient]);

  const favoriteIds = favorites.map(f => f.product_id);

  const toggleFavorite = useMutation({
    mutationFn: async (productId) => {
      const existing = favorites.find(f => f.product_id === productId);
      if (existing) {
        await deleteFavorite(existing.id);
      } else {
        await createFavorite({ user_email: user.email, product_id: productId });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    if (filters.category && filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }
    if (filters.size && filters.size !== 'all') {
      result = result.filter(p => p.size === filters.size);
    }
    if (filters.gender && filters.gender !== 'all') {
      result = result.filter(p => p.gender === filters.gender);
    }

    if (filters.sort === 'price') result.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (filters.sort === '-price') result.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (filters.sort === '-views') result.sort((a, b) => (b.views || 0) - (a.views || 0));

    return result;
  }, [products, filters]);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-8 sm:py-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          <Sparkles className="w-3 h-3" />
          Moda sostenible, estilo único
        </div>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight">
          Dale una segunda vida
          <br />
          <span className="text-primary">a tu armario</span>
        </h1>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto text-sm sm:text-base">
          Compra y vende ropa de segunda mano. Moda circular para un mundo mejor.
        </p>
      </div>

      {/* Filters */}
      <FilterBar filters={filters} onFilterChange={setFilters} />

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
        </p>
      </div>

      {/* Products Grid */}
      <ProductGrid
        products={filteredProducts}
        isLoading={isLoading}
        favoriteIds={favoriteIds}
        onToggleFavorite={(id) => toggleFavorite.mutate(id)}
      />
    </div>
  );
}