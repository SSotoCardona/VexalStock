import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { getProducts, getReviewsBySellerEmail } from '@/api/backendClient';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/componentes/ui/card';
import { Badge } from '@/componentes/ui/badge';
import { Separator } from '@/componentes/ui/separator';
import { User, Package, ShoppingBag, Star, Eye } from 'lucide-react';
import ProductGrid from '@/componentes/products/ProductGrid';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user } = useAuth();

  const { data: myProducts = [] } = useQuery({
    queryKey: ['my-products', user?.email],
    queryFn: () => getProducts({ sellerEmail: user.email }),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['my-reviews', user?.email],
    queryFn: () => getReviewsBySellerEmail(user.email),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const totalViews = myProducts.reduce((s, p) => s + (p.views || 0), 0);
  const totalSold = myProducts.filter(p => p.status === 'vendido').length;
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '-';

  const stats = [
    { label: 'Publicados', value: myProducts.length, icon: Package },
    { label: 'Vendidos', value: totalSold, icon: ShoppingBag },
    { label: 'Vistas', value: totalViews, icon: Eye },
    { label: 'Valoración', value: avgRating, icon: Star },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Profile header */}
      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold">{user?.full_name || 'Mi perfil'}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <Badge variant="secondary" className="mt-1 text-xs capitalize">{user?.role || 'usuario'}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* My products */}
      <div>
        <h2 className="font-heading text-lg font-semibold mb-4">Mis publicaciones</h2>
        {myProducts.length ? (
          <ProductGrid products={myProducts} />
        ) : (
          <div className="text-center py-12">
            <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No has publicado productos aún</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}