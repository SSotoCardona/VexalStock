# VexalStock

VexalStock es una aplicación de marketplace para comprar y vender ropa de segunda mano. El proyecto está dividido en un frontend React/Vite y un backend Spring Boot que trabaja con PostgreSQL.

## Estructura general del proyecto

- `/src/` - Frontend React con Vite.
- `/backend/` - Backend Java Spring Boot.
- `/uploads/` - Directorio para almacenar imágenes subidas.
- `/entidades/` - Archivos JSON de ejemplo con datos de entidades.
- `/target/` - Salida de compilación Maven para el backend.

## Frontend (`/src`)

El frontend está desarrollado con React 18, Vite y Tailwind CSS. Tiene estas carpetas principales:

- `src/App.jsx` - Configura rutas con React Router y envuelve la app en `AuthProvider`, `QueryClientProvider`, `ErrorBoundary` y `Toaster`.
- `src/main.jsx` - Punto de entrada que monta la aplicación.
- `src/index.css` - Estilos globales.

Carpetas principales:

- `src/api/` - Cliente HTTP para comunicarse con el backend (`backendClient.js`).
- `src/componentes/` - Componentes reutilizables de UI.
  - `layout/` - Componentes de estructura de la aplicación, como `Navbar` y `AppLayout`.
  - `products/` - Componentes de listado de productos: `FilterBar`, `ProductGrid`, `ProductCard`.
  - `ui/` - Componentes de interfaz genéricos y wrappers de Radix UI.
- `src/paginas/` - Vistas y páginas principales de la aplicación.
  - `Home.jsx` - Página principal con búsqueda, filtros y catálogo de productos.
  - `ProductDetail.jsx` - Detalle de producto.
  - `SellProduct.jsx` - Formulario para publicar un producto.
  - `Cart.jsx`, `Checkout.jsx` - Gestión de carrito y proceso de compra.
  - `Favorites.jsx` - Productos favoritos.
  - `Messages.jsx` - Mensajería entre usuarios.
  - `MyOrders.jsx` - Pedidos de compra/venta.
  - `Profile.jsx` - Perfil del usuario.
  - `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx` - Autenticación.
- `src/lib/` - Lógica compartida.
  - `AuthContext.jsx` - Contexto de autenticación.
  - `query-client.js` - Configuración de React Query.
  - `utils.js` - Utilidades generales.
- `src/hooks/` - Hooks personalizados.
- `src/utils/` - Utilidades adicionales.

## Backend (`/backend`)

El backend es una API REST con Spring Boot y JPA, usando PostgreSQL como base de datos.

- `backend/pom.xml` - Dependencias y configuración de Maven.
- `backend/src/main/java/com/vexalstock/backend/` - Código fuente principal.
  - `controller/` - Controladores REST que exponen endpoints para productos, favoritos, carrito, órdenes, mensajes y revisiones.
  - `service/` - Lógica de negocio y reglas del dominio.
  - `repository/` - Repositorios Spring Data JPA para acceso a datos.
  - `model/` - Entidades JPA que representan los datos.
  - `config/` - Configuraciones adicionales, como limpieza de productos vacíos.
- `backend/src/main/resources/application.properties` - Configuración de base de datos y propiedades de Spring.

### Configuración de base de datos

El backend espera una base de datos PostgreSQL en:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/vexalstock
spring.datasource.username=postgres
spring.datasource.password=12345
```

Asegúrate de crear la base de datos `vexalstock` y ajustar estas credenciales si es necesario.

## Cómo ejecutar el proyecto

### Frontend

```bash
npm install
npm run dev
```

Para compilar en modo producción:

```bash
npm run build
```

### Backend

Desde la carpeta `/backend`:

```bash
cd backend
mvn spring-boot:run
```

## Qué hace cada carpeta

- `src/` - Código del cliente web.
- `backend/` - Servicio API REST.
- `uploads/` - Archivos de imágenes subidas por los usuarios.
- `entidades/` - Datos de ejemplo en formato JSON.
- `target/` - Resultado de la compilación Maven (no se modifica manualmente).

## Funcionalidad principal

- Buscar y filtrar productos por categoría, talla, género y orden.
- Ver detalles de cada producto.
- Agregar productos a favoritos y carrito.
- Publicar productos para venta.
- Gestión de pedidos y mensajes.
- Autenticación de usuarios con páginas de login, registro y recuperación de contraseña.

## Notas adicionales

- El frontend consume la API del backend en `http://localhost:8080/api`.
- El backend serializa JSON usando `snake_case`.
- El proyecto combina React, Tailwind CSS y React Query en el frontend con Spring Boot y PostgreSQL en el backend.
