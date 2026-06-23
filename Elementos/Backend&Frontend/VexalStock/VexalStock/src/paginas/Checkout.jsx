import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { getCartItems, getProductById, createOrder, updateProduct, deleteCartItem } from '@/api/backendClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Textarea } from '@/componentes/ui/textarea';
import { Label } from '@/componentes/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/componentes/ui/card';
import { Separator } from '@/componentes/ui/separator';
import { CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Checkout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [form, setForm] = useState({ address: '', city: '', phone: '', notes: '' });

  const { data: items = [] } = useQuery({
    queryKey: ['cart-checkout', user?.email],
    queryFn: () => getCartItems(user.email),
    enabled: !!user,
  });

  const total = items.reduce((s, i) => s + (i.price || 0), 0);

  const placeOrder = useMutation({
    mutationFn: async () => {
      const order = await createOrder({
        buyer_email: user.email,
        buyer_name: user.full_name || user.email,
        items: items.map(i => ({ product_id: i.product_id, title: i.title, price: i.price, image: i.image })),
        total,
        status: 'pendiente',
        shipping_address: form.address,
        shipping_city: form.city,
        shipping_phone: form.phone,
        notes: form.notes,
      });
      // Mark products as reserved & clear cart
      for (const item of items) {
        const product = await getProductById(item.product_id);
        if (product) {
          await updateProduct(item.product_id, { ...product, status: 'reservado' });
        }
        await deleteCartItem(item.id);
      }
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart-checkout'] });
      queryClient.invalidateQueries({ queryKey: ['cart-count'] });
      toast.success('¡Pedido realizado exitosamente!');
      navigate('/my-orders');
    },
  });

  if (!items.length) {
    navigate('/cart');
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-heading text-2xl sm:text-3xl font-bold">Finalizar compra</h1>

      {/* Order summary */}
      <Card>
        <CardHeader><CardTitle className="text-base">Resumen del pedido</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="truncate mr-4">{item.title}</span>
              <span className="font-medium">${item.price?.toFixed(2)}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Shipping info */}
      <Card>
        <CardHeader><CardTitle className="text-base">Información de envío</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Dirección *</Label>
            <Input placeholder="Calle, número, colonia..." value={form.address} onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Ciudad *</Label>
              <Input placeholder="Ciudad" value={form.city} onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))} />
            </div>
            <div>
              <Label>Teléfono *</Label>
              <Input placeholder="+52..." value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>
          <div>
            <Label>Notas adicionales</Label>
            <Textarea placeholder="Instrucciones de entrega..." value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
        </CardContent>
      </Card>

      <Button
        size="lg"
        className="w-full rounded-xl gap-2"
        disabled={!form.address || !form.city || !form.phone || placeOrder.isPending}
        onClick={() => placeOrder.mutate()}
      >
        {placeOrder.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
        Confirmar pedido
      </Button>
    </motion.div>
  );
}