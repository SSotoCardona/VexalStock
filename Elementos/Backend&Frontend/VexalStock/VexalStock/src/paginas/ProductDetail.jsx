import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { getProductById, updateProduct, getReviewsByProductId, addCartItem } from '@/api/backendClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/componentes/ui/button';
import { Badge } from '@/componentes/ui/badge';
import { Separator } from '@/componentes/ui/separator';
import { Heart, ShoppingBag, MessageCircle, ArrowLeft, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
// removed framer-motion wrapper to avoid DOM removal conflicts during route transitions

const conditionLabels = {
  nuevo_con_etiqueta: 'Nuevo con etiqueta',
  como_nuevo: 'Como nuevo',
  buen_estado: 'Buen estado',
  uso_visible: 'Uso visible',
  para_reparar: 'Para reparar',
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [currentImage, setCurrentImage] = useState(0);
  React.useEffect(() => {
    setCurrentImage(0);
  }, [id]);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const p = await getProductById(id);
      if (!p) return null;
      if (p?.id) {
        try {
          await updateProduct(p.id, { ...p, views: (p.views || 0) + 1 });
        } catch (e) {
          console.warn('Failed to increment views for product', p.id, e?.message || e);
        }
      }
      return p;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getReviewsByProductId(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const addToCart = useMutation({
    mutationFn: () => addCartItem({
      user_email: user.email,
      product_id: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || '',
      size: product.size,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart-count'] });
      toast.success('Producto agregado al carrito');
    },
  });

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;
  const placeholder = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=800&fit=crop';
  const images = Array.isArray(product?.images) && product.images.length
    ? product.images.filter(img => typeof img === 'string' && img.trim() && !img.startsWith('blob:'))
    : [];
  const safeImages = images.length ? images : [placeholder];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Producto no encontrado</p>
        <Link to="/"><Button variant="outline" className="mt-4">Volver al catálogo</Button></Link>
      </div>
    );
  }

  const isOwnProduct = user?.email === product.seller_email;
  const isSold = product.status === 'vendido';

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2 text-muted-foreground">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="relative">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
            <img src={safeImages[Math.min(currentImage, safeImages.length - 1)]} alt={product.title || 'Producto'} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <>
              <Button
                variant="secondary" size="icon"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 bg-white/80 backdrop-blur"
                onClick={() => setCurrentImage(i => i > 0 ? i - 1 : images.length - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary" size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 bg-white/80 backdrop-blur"
                onClick={() => setCurrentImage(i => i < images.length - 1 ? i + 1 : 0)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <div className="flex justify-center gap-1.5 mt-3">
                {safeImages.map((_, i) => (
                  <button
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? 'bg-primary w-6' : 'bg-muted-foreground/30'}`}
                    onClick={() => setCurrentImage(i)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">{product.category}</Badge>
              {avgRating && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  {avgRating} ({reviews.length})
                </div>
              )}
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold">{product.title}</h1>
            <p className="text-3xl font-bold text-primary mt-2">${product.price?.toFixed(2)}</p>
            {product.original_price && (
              <p className="text-sm text-muted-foreground line-through">
                Original: ${product.original_price?.toFixed(2)}
              </p>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Talla:</span> <span className="font-medium">{product.size}</span></div>
            <div><span className="text-muted-foreground">Estado:</span> <span className="font-medium">{conditionLabels[product.condition]}</span></div>
            <div><span className="text-muted-foreground">Marca:</span> <span className="font-medium">{product.brand || 'Sin marca'}</span></div>
            <div><span className="text-muted-foreground">Color:</span> <span className="font-medium">{product.color || 'N/A'}</span></div>
            <div><span className="text-muted-foreground">Género:</span> <span className="font-medium capitalize">{product.gender || 'Unisex'}</span></div>
            <div><span className="text-muted-foreground">Vendedor:</span> <span className="font-medium">{product.seller_name || 'Anónimo'}</span></div>
          </div>

          {product.description && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-2">Descripción</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {!isOwnProduct && !isSold && (
              <>
                <Button size="lg" className="gap-2 rounded-xl" onClick={() => addToCart.mutate()} disabled={addToCart.isPending}>
                  <ShoppingBag className="w-4 h-4" />
                  Agregar al carrito
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 rounded-xl"
                  onClick={() => navigate(`/messages?to=${product.seller_email}&product=${product.id}`)}
                >
                  <MessageCircle className="w-4 h-4" />
                  Contactar vendedor
                </Button>
              </>
            )}
            {isSold && (
              <Badge variant="secondary" className="w-fit text-sm py-2 px-4">Este producto ya fue vendido</Badge>
            )}
          </div>

          {/* Reviews */}
          {reviews.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-3">Reseñas ({reviews.length})</h3>
                <div className="space-y-3">
                  {reviews.slice(0, 3).map(r => (
                    <div key={r.id} className="bg-muted/50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{r.reviewer_name || 'Anónimo'}</span>
                      </div>
                      {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}