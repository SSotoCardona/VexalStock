import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { getOrders } from '@/api/backendClient';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/componentes/ui/card';
import { Badge } from '@/componentes/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/componentes/ui/tabs';
import { Package, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const statusColors = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  confirmado: 'bg-blue-100 text-blue-800',
  enviado: 'bg-purple-100 text-purple-800',
  entregado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800',
};

export default function MyOrders() {
  const { user } = useAuth();

  const { data: buyOrders = [], isLoading: loadingBuy } = useQuery({
    queryKey: ['my-buy-orders', user?.email],
    queryFn: () => getOrders({ buyerEmail: user.email }),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const { data: sellOrders = [], isLoading: loadingSell } = useQuery({
    queryKey: ['my-sell-orders', user?.email],
    queryFn: () => getOrders({ sellerEmail: user.email }),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const OrderCard = ({ order }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {order.created_date ? format(new Date(order.created_date), 'dd/MM/yyyy HH:mm') : ''}
            </span>
            <Badge className={`text-xs ${statusColors[order.status] || 'bg-muted text-muted-foreground'}`}>
              {order.status}
            </Badge>
          </div>
          <div className="space-y-2">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img src={item.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100&h=100&fit=crop'} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">${item.price?.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-semibold text-primary">${order.total?.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const EmptyState = ({ icon: Icon, text }) => (
    <div className="text-center py-16 space-y-3">
      <Icon className="w-10 h-10 text-muted-foreground/30 mx-auto" />
      <p className="text-muted-foreground text-sm">{text}</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-heading text-2xl sm:text-3xl font-bold">Mis pedidos</h1>

      <Tabs defaultValue="compras">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="compras">Compras ({buyOrders.length})</TabsTrigger>
          <TabsTrigger value="ventas">Ventas ({sellOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="compras" className="space-y-3 mt-4">
          {loadingBuy ? (
            <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" /></div>
          ) : buyOrders.length ? (
            buyOrders.map(o => <OrderCard key={o.id} order={o} />)
          ) : (
            <EmptyState icon={ShoppingBag} text="No tienes compras aún" />
          )}
        </TabsContent>

        <TabsContent value="ventas" className="space-y-3 mt-4">
          {loadingSell ? (
            <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" /></div>
          ) : sellOrders.length ? (
            sellOrders.map(o => <OrderCard key={o.id} order={o} />)
          ) : (
            <EmptyState icon={Package} text="No tienes ventas aún" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}