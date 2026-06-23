# API Endpoints - VexalStock

Documentación de todos los endpoints disponibles en la API REST de VexalStock. La URL base es `http://localhost:8080/api`.

---

## Products (`/api/products`)

### GET - Obtener productos
**Endpoint:** `GET /api/products`

Obtiene una lista de productos con filtros opcionales.

**Parámetros de query (opcionales):**
- `status` - Filtrar por estado (ej: `disponible`, `vendido`, `reservado`)
- `category` - Filtrar por categoría (ej: `camisetas`, `pantalones`, `vestidos`)
- `sellerEmail` - Obtener productos de un vendedor específico

**Ejemplo:**
```
GET /api/products?status=disponible&category=camisetas
GET /api/products?sellerEmail=usuario@example.com
```

**Respuesta:** Lista de productos.

---

### GET - Obtener producto por ID
**Endpoint:** `GET /api/products/{id}`

Obtiene un producto específico por su ID.

**Parámetros:**
- `id` (path) - ID del producto

**Ejemplo:**
```
GET /api/products/1
```

**Respuesta:** Objeto producto o 404 si no existe.

---

### POST - Crear producto (JSON)
**Endpoint:** `POST /api/products`

Crea un producto con datos en JSON.

**Content-Type:** `application/json`

**Body:**
```json
{
  "title": "Camiseta Nike",
  "description": "Camiseta deportiva en buen estado",
  "price": 25.99,
  "original_price": 50.00,
  "category": "camisetas",
  "size": "M",
  "gender": "mujer",
  "condition": "como_nuevo",
  "sellerEmail": "vendedor@example.com",
  "seller_name": "Juan Vendedor",
  "images": ["url_imagen1", "url_imagen2"],
  "status": "disponible"
}
```

**Respuesta:** Objeto producto creado.

---

### POST - Crear producto (Multipart)
**Endpoint:** `POST /api/products`

Crea un producto con imágenes adjuntas en multipart.

**Content-Type:** `multipart/form-data`

**Parámetros:**
- `title` - Título del producto
- `description` - Descripción
- `price` - Precio
- `original_price` - Precio original
- `category` - Categoría
- `size` - Talla
- `gender` - Género
- `condition` - Condición
- `sellerEmail` - Email del vendedor
- `seller_name` - Nombre del vendedor
- `status` - Estado
- `imageFiles` (file) - Imágenes a subir

**Respuesta:** Objeto producto creado con URLs de imágenes.

---

### PUT - Actualizar producto
**Endpoint:** `PUT /api/products/{id}`

Actualiza un producto existente.

**Parámetros:**
- `id` (path) - ID del producto

**Content-Type:** `application/json`

**Body:** Objeto producto con los campos a actualizar.

**Respuesta:** Objeto producto actualizado o 404 si no existe.

---

### DELETE - Eliminar producto
**Endpoint:** `DELETE /api/products/{id}`

Elimina un producto por su ID.

**Parámetros:**
- `id` (path) - ID del producto

**Respuesta:** 204 No Content.

---

### DELETE - Limpiar productos vacíos
**Endpoint:** `DELETE /api/products/cleanup-empty`

Elimina todos los productos que no tienen título o título vacío.

**Respuesta:** 204 No Content.

---

## Cart (`/api/cart`)

### GET - Obtener carrito del usuario
**Endpoint:** `GET /api/cart`

Obtiene todos los artículos del carrito de un usuario.

**Parámetros de query:**
- `userEmail` (requerido) - Email del usuario

**Ejemplo:**
```
GET /api/cart?userEmail=usuario@example.com
```

**Respuesta:** Lista de artículos en el carrito.

---

### POST - Agregar artículo al carrito
**Endpoint:** `POST /api/cart`

Agrega un artículo al carrito.

**Content-Type:** `application/json`

**Body:**
```json
{
  "user_email": "usuario@example.com",
  "product_id": 1,
  "title": "Camiseta Nike",
  "price": 25.99,
  "image": "url_imagen",
  "quantity": 1
}
```

**Respuesta:** Objeto CartItem creado.

---

### DELETE - Eliminar artículo del carrito
**Endpoint:** `DELETE /api/cart/{id}`

Elimina un artículo específico del carrito.

**Parámetros:**
- `id` (path) - ID del artículo en el carrito

**Ejemplo:**
```
DELETE /api/cart/5
```

**Respuesta:** 204 No Content.

---

### DELETE - Eliminar artículo por producto
**Endpoint:** `DELETE /api/cart`

Elimina todos los artículos de un producto del carrito de un usuario.

**Parámetros de query:**
- `userEmail` (requerido) - Email del usuario
- `productId` (requerido) - ID del producto

**Ejemplo:**
```
DELETE /api/cart?userEmail=usuario@example.com&productId=1
```

**Respuesta:** 204 No Content.

---

## Favorites (`/api/favorites`)

### GET - Obtener favoritos del usuario
**Endpoint:** `GET /api/favorites`

Obtiene todos los favoritos de un usuario.

**Parámetros de query:**
- `userEmail` (requerido) - Email del usuario

**Ejemplo:**
```
GET /api/favorites?userEmail=usuario@example.com
```

**Respuesta:** Lista de favoritos.

---

### POST - Agregar a favoritos
**Endpoint:** `POST /api/favorites`

Agrega un producto a favoritos.

**Content-Type:** `application/json`

**Body:**
```json
{
  "user_email": "usuario@example.com",
  "product_id": 1
}
```

**Respuesta:** Objeto Favorite creado.

---

### DELETE - Eliminar de favoritos
**Endpoint:** `DELETE /api/favorites/{id}`

Elimina un producto de favoritos.

**Parámetros:**
- `id` (path) - ID del favorito

**Ejemplo:**
```
DELETE /api/favorites/3
```

**Respuesta:** 204 No Content.

---

## Orders (`/api/orders`)

### GET - Obtener órdenes
**Endpoint:** `GET /api/orders`

Obtiene órdenes con filtros opcionales.

**Parámetros de query (opcionales):**
- `buyerEmail` - Órdenes de un comprador
- `sellerEmail` - Órdenes de un vendedor

**Ejemplo:**
```
GET /api/orders?buyerEmail=comprador@example.com
GET /api/orders?sellerEmail=vendedor@example.com
```

**Respuesta:** Lista de órdenes.

---

### GET - Obtener orden por ID
**Endpoint:** `GET /api/orders/{id}`

Obtiene una orden específica.

**Parámetros:**
- `id` (path) - ID de la orden

**Ejemplo:**
```
GET /api/orders/1
```

**Respuesta:** Objeto Order o 404 si no existe.

---

### POST - Crear orden
**Endpoint:** `POST /api/orders`

Crea una nueva orden.

**Content-Type:** `application/json`

**Body:**
```json
{
  "buyer_email": "comprador@example.com",
  "seller_email": "vendedor@example.com",
  "total_price": 50.99,
  "status": "pendiente",
  "items": [
    {
      "product_id": 1,
      "title": "Camiseta",
      "price": 25.99,
      "image": "url_imagen"
    }
  ]
}
```

**Respuesta:** Objeto Order creado.

---

### DELETE - Eliminar orden
**Endpoint:** `DELETE /api/orders/{id}`

Elimina una orden.

**Parámetros:**
- `id` (path) - ID de la orden

**Ejemplo:**
```
DELETE /api/orders/1
```

**Respuesta:** 204 No Content.

---

## Messages (`/api/messages`)

### GET - Obtener mensajes
**Endpoint:** `GET /api/messages`

Obtiene mensajes con filtros opcionales.

**Parámetros de query (opcionales):**
- `receiverEmail` - Mensajes recibidos por un usuario
- `senderEmail` - Mensajes enviados por un usuario
- `unreadOnly` - Filtrar solo mensajes no leídos (true/false)

**Ejemplo:**
```
GET /api/messages?receiverEmail=usuario@example.com
GET /api/messages?receiverEmail=usuario@example.com&unreadOnly=true
GET /api/messages?senderEmail=otro@example.com
```

**Respuesta:** Lista de mensajes.

---

### GET - Obtener mensaje por ID
**Endpoint:** `GET /api/messages/{id}`

Obtiene un mensaje específico.

**Parámetros:**
- `id` (path) - ID del mensaje

**Ejemplo:**
```
GET /api/messages/5
```

**Respuesta:** Objeto Message o 404 si no existe.

---

### POST - Enviar mensaje
**Endpoint:** `POST /api/messages`

Envía un nuevo mensaje.

**Content-Type:** `application/json`

**Body:**
```json
{
  "sender_email": "usuario@example.com",
  "receiver_email": "otro@example.com",
  "product_id": 1,
  "product_title": "Camiseta Nike",
  "content": "¿El producto sigue disponible?",
  "is_read": false,
  "created_at": "2026-06-11T10:30:00"
}
```

**Respuesta:** Objeto Message creado.

---

### PUT - Actualizar mensaje
**Endpoint:** `PUT /api/messages/{id}`

Actualiza un mensaje (principalmente para marcar como leído).

**Parámetros:**
- `id` (path) - ID del mensaje

**Content-Type:** `application/json`

**Body:**
```json
{
  "is_read": true
}
```

**Respuesta:** Objeto Message actualizado o 404 si no existe.

---

### DELETE - Eliminar mensaje
**Endpoint:** `DELETE /api/messages/{id}`

Elimina un mensaje.

**Parámetros:**
- `id` (path) - ID del mensaje

**Ejemplo:**
```
DELETE /api/messages/5
```

**Respuesta:** 204 No Content.

---

## Reviews (`/api/reviews`)

### GET - Obtener reseñas
**Endpoint:** `GET /api/reviews`

Obtiene reseñas con filtros opcionales.

**Parámetros de query (opcionales):**
- `productId` - Reseñas de un producto
- `sellerEmail` - Reseñas de un vendedor

**Ejemplo:**
```
GET /api/reviews?productId=1
GET /api/reviews?sellerEmail=vendedor@example.com
```

**Respuesta:** Lista de reseñas.

---

### GET - Obtener reseña por ID
**Endpoint:** `GET /api/reviews/{id}`

Obtiene una reseña específica.

**Parámetros:**
- `id` (path) - ID de la reseña

**Ejemplo:**
```
GET /api/reviews/2
```

**Respuesta:** Objeto Review o 404 si no existe.

---

### POST - Crear reseña
**Endpoint:** `POST /api/reviews`

Crea una nueva reseña.

**Content-Type:** `application/json`

**Body:**
```json
{
  "product_id": 1,
  "buyer_email": "comprador@example.com",
  "seller_email": "vendedor@example.com",
  "rating": 5,
  "comment": "Excelente producto, muy recomendado",
  "created_at": "2026-06-11T11:00:00"
}
```

**Respuesta:** Objeto Review creado.

---

### DELETE - Eliminar reseña
**Endpoint:** `DELETE /api/reviews/{id}`

Elimina una reseña.

**Parámetros:**
- `id` (path) - ID de la reseña

**Ejemplo:**
```
DELETE /api/reviews/2
```

**Respuesta:** 204 No Content.

---

## Notas generales

- **URL Base:** `http://localhost:8080/api`
- **Content-Type:** La mayoría de endpoints usa `application/json`, excepto los que manejan upload de archivos que usan `multipart/form-data`.
- **Respuestas de error:** Los códigos HTTP indicarán el estado:
  - `200 OK` - Solicitud exitosa
  - `204 No Content` - Operación exitosa sin contenido
  - `400 Bad Request` - Datos inválidos
  - `404 Not Found` - Recurso no encontrado
- **Formato de datos:** Las propiedades en JSON se usan en `snake_case` según la configuración de Jackson en `application.properties`.
