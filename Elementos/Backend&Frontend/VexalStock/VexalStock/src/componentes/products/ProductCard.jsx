import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import { Badge } from '@/componentes/ui/badge';

const conditionLabels = {
  nuevo_con_etiqueta: 'Nuevo',
  como_nuevo: 'Como nuevo',
  buen_estado: 'Buen estado',
  uso_visible: 'Uso visible',
  para_reparar: 'Para reparar',
};

export default function ProductCard({ product, isFavorite, onToggleFavorite }) {
  const placeholderImage = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=500&fit=crop';
  const mainImage = (product.images || []).find((img) => typeof img === 'string' && !img.startsWith('blob:') && img.trim()) || placeholderImage;

  return (
    <div className="group">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted">
        <Link to={product.id ? `/product/${product.id}` : '#'} className="block h-full w-full">
          <img
            src={mainImage}
            alt={product.title || 'Producto'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite?.(product.id);
          }}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition-all hover:scale-110"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-primary text-primary' : 'text-foreground/60'}`} />
        </button>

        {/* Condition badge */}
        <Badge className="absolute top-3 left-3 bg-white/90 backdrop-blur text-foreground/80 text-[10px] font-medium border-0">
          {conditionLabels[product.condition] || product.condition}
        </Badge>

        {/* Status badge */}
        {product.status === 'reservado' && (
          <Badge className="absolute bottom-3 left-3 bg-accent text-accent-foreground text-xs">
            Reservado
          </Badge>
        )}
        {product.status === 'vendido' && (
          <Badge className="absolute bottom-3 left-3 bg-muted-foreground text-white text-xs">
            Vendido
          </Badge>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium truncate">{product.title}</h3>
          <span className="text-sm font-semibold text-primary whitespace-nowrap">
            ${product.price?.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{product.brand || 'Sin marca'}</span>
          <span>·</span>
          <span>{product.size}</span>
          {product.views > 0 && (
            <>
              <span>·</span>
              <Eye className="w-3 h-3" />
              <span>{product.views}</span>
            </>
          )}
        </div>
      </div>
      </div>
  );
}