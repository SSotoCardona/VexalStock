import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { createProduct as createBackendProduct } from '@/api/backendClient';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Textarea } from '@/componentes/ui/textarea';
import { Label } from '@/componentes/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/componentes/ui/card';
import { Upload, Camera, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function SellProduct() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', price: '', original_price: '',
    category: undefined, size: undefined, condition: undefined, brand: '', color: '', gender: undefined,
  });

  const { user } = useAuth();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setUploading(true);

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
    setUploading(false);
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const removed = prev[index];
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const createProduct = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('price', form.price);
      if (form.original_price) formData.append('originalPrice', form.original_price);
      formData.append('category', form.category);
      formData.append('size', form.size);
      formData.append('condition', form.condition);
      formData.append('brand', form.brand);
      formData.append('color', form.color);
      formData.append('sellerEmail', user?.email || '');
      formData.append('sellerName', user?.full_name || user?.email || '');
      formData.append('status', 'disponible');
      formData.append('views', '0');

      images.forEach((image) => {
        formData.append('imageFiles', image.file);
      });

      return createBackendProduct(formData);
    },
    onSuccess: () => {
      toast.success('¡Producto publicado exitosamente!');
      navigate('/');
    },
  });

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl sm:text-3xl font-bold mb-6">Publicar producto</h1>

      <div className="space-y-6">
        {/* Images */}
        <Card>
          <CardHeader><CardTitle className="text-base">Fotos</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden bg-muted group">
                  <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                {uploading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </span>
                ) : (
                  <span className="flex flex-col items-center">
                    <Camera className="w-5 h-5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground mt-1">Agregar</span>
                  </span>
                )}
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardHeader><CardTitle className="text-base">Detalles</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Título *</Label>
              <Input placeholder="Ej: Camiseta Nike Air Max" value={form.title} onChange={(e) => updateField('title', e.target.value)} />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea placeholder="Describe tu producto..." value={form.description} onChange={(e) => updateField('description', e.target.value)} className="h-24" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Precio (COP) *</Label>
                <Input type="number" placeholder="0.00" value={form.price} onChange={(e) => updateField('price', e.target.value)} />
              </div>
              <div>
                <Label>Precio original</Label>
                <Input type="number" placeholder="0.00" value={form.original_price} onChange={(e) => updateField('original_price', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Marca</Label>
                <Input placeholder="Ej: Nike" value={form.brand} onChange={(e) => updateField('brand', e.target.value)} />
              </div>
              <div>
                <Label>Color</Label>
                <Input placeholder="Ej: Negro" value={form.color} onChange={(e) => updateField('color', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Classification */}
        <Card>
          <CardHeader><CardTitle className="text-base">Clasificación</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Categoría *</Label>
                <select
                  value={form.category || ''}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="block h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="" disabled>Selecciona</option>
                  {['camisetas','pantalones','vestidos','chaquetas','zapatos','accesorios','faldas','sudaderas','camisas','otros'].map((c) => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Talla *</Label>
                <select
                  value={form.size || ''}
                  onChange={(e) => updateField('size', e.target.value)}
                  className="block h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="" disabled>Selecciona</option>
                  {['XS','S','M','L','XL','XXL','Único'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Estado *</Label>
                <select
                  value={form.condition || ''}
                  onChange={(e) => updateField('condition', e.target.value)}
                  className="block h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="" disabled>Selecciona</option>
                  <option value="nuevo_con_etiqueta">Nuevo con etiqueta</option>
                  <option value="como_nuevo">Como nuevo</option>
                  <option value="buen_estado">Buen estado</option>
                  <option value="uso_visible">Uso visible</option>
                  <option value="para_reparar">Para reparar</option>
                </select>
              </div>
              <div>
                <Label>Género</Label>
                <select
                  value={form.gender || ''}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className="block h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="" disabled>Selecciona</option>
                  <option value="mujer">Mujer</option>
                  <option value="hombre">Hombre</option>
                  <option value="unisex">Unisex</option>
                  <option value="niños">Niños</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          size="lg"
          className="w-full rounded-xl gap-2"
          disabled={!form.title || !form.price || !form.category || !form.size || !form.condition || createProduct.isPending}
          onClick={() => createProduct.mutate()}
        >
          {createProduct.isPending ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Publicando...</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>Publicar producto</span>
            </span>
          )}
        </Button>
      </div>
    </motion.div>
  );
}