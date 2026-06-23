import React from 'react';
import { Input } from '@/componentes/ui/input';
import { Button } from '@/componentes/ui/button';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const categories = [
  { value: 'all', label: 'Todas' },
  { value: 'camisetas', label: 'Camisetas' },
  { value: 'pantalones', label: 'Pantalones' },
  { value: 'vestidos', label: 'Vestidos' },
  { value: 'chaquetas', label: 'Chaquetas' },
  { value: 'zapatos', label: 'Zapatos' },
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'faldas', label: 'Faldas' },
  { value: 'sudaderas', label: 'Sudaderas' },
  { value: 'camisas', label: 'Camisas' },
  { value: 'otros', label: 'Otros' },
];

const sizes = [
  { value: 'all', label: 'Todas' },
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
];

const genders = [
  { value: 'all', label: 'Todos' },
  { value: 'mujer', label: 'Mujer' },
  { value: 'hombre', label: 'Hombre' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'niños', label: 'Niños' },
];

const sortOptions = [
  { value: '-created_date', label: 'Más recientes' },
  { value: 'price', label: 'Menor precio' },
  { value: '-price', label: 'Mayor precio' },
  { value: '-views', label: 'Más vistos' },
];

export default function FilterBar({ filters, onFilterChange }) {
  const hasActiveFilters = filters.search || 
    (filters.category && filters.category !== 'all') || 
    (filters.size && filters.size !== 'all') || 
    (filters.gender && filters.gender !== 'all');

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar ropa, marcas, estilos..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="pl-10 h-11 bg-muted/50 border-0 rounded-xl text-sm"
        />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-muted-foreground hidden sm:block" />
        
        <select
          value={filters.category || 'all'}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          className="w-[130px] h-11 rounded-xl border border-input bg-muted/50 px-3 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
          aria-label="Categoría"
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <select
          value={filters.size || 'all'}
          onChange={(e) => onFilterChange({ ...filters, size: e.target.value })}
          className="w-[100px] h-11 rounded-xl border border-input bg-muted/50 px-3 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
          aria-label="Talla"
        >
          {sizes.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <select
          value={filters.gender || 'all'}
          onChange={(e) => onFilterChange({ ...filters, gender: e.target.value })}
          className="w-[110px] h-11 rounded-xl border border-input bg-muted/50 px-3 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
          aria-label="Género"
        >
          {genders.map((g) => (
            <option key={g.value} value={g.value}>{g.label}</option>
          ))}
        </select>

        <select
          value={filters.sort || '-created_date'}
          onChange={(e) => onFilterChange({ ...filters, sort: e.target.value })}
          className="w-[140px] h-11 rounded-xl border border-input bg-muted/50 px-3 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
          aria-label="Ordenar"
        >
          {sortOptions.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 text-xs text-muted-foreground"
            onClick={() => onFilterChange({ search: '', category: 'all', size: 'all', gender: 'all', sort: '-created_date' })}
          >
            <X className="w-3 h-3 mr-1" />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  );
}