import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { getCartItems, deleteCartItem } from '@/api/backendClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/componentes/ui/button';
import { Card, CardContent } from '@/componentes/ui/card';
import { Separator } from '@/componentes/ui/separator';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['cart', user?.email],
    queryFn: () => getCartItems(user.email),
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });

  const removeItem = useMutation({
    mutationFn: (id) => deleteCartItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cart-count'] });
      toast.success('Producto eliminado');
    },
  });

  const total = items.reduce((sum, item) => sum + (item.price || 0), 0);

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>;
  }

  if (!items.length) {
    return (
      <div className="text-center py-20 space-y-4">
        <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto" />
        <h2 className="font-heading text-xl font-semibold">Tu carrito está vacío</h2>
        <p className="text-muted-foreground text-sm">Explora nuestro catálogo y encuentra prendas únicas</p>
        <Link to="/"><Button className="rounded-xl gap-2">Explorar catálogo <ArrowRight className="w-4 h-4" /></Button></Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-heading text-2xl sm:text-3xl font-bold">Carrito ({items.length})</h1>

      <div className="space-y-3">
        <AnimatePresence>
          {items.map(item => (
            <motion.div key={item.id} exit={{ opacity: 0, x: -100 }} layout>
              <Card>
                <CardContent className="p-4 flex gap-4">
                  <Link to={`/product/${item.product_id}`}>
                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img src={item.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=250&fit=crop'} alt="" className="w-full h-full object-cover" />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Talla: {item.size}</p>
                    <p className="text-lg font-semibold text-primary mt-2">${item.price?.toFixed(2)}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="flex-shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeItem.mutate(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Total</span>
        <span className="text-2xl font-bold">${total.toFixed(2)}</span>
      </div>

      <Button size="lg" className="w-full rounded-xl gap-2" onClick={() => navigate('/checkout')}>
        Proceder al pago <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}