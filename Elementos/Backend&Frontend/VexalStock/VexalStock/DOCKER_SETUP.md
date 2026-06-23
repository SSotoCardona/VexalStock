# 🐳 Guía de Docker - VexalStock

Esta guía te permite ejecutar **VexalStock** en cualquier computador con solo **Docker instalado**.

---

## 📋 Requisitos Previos

✅ **Docker Desktop instalado**
- Windows/Mac: https://www.docker.com/products/docker-desktop
- Linux: `sudo apt-get install docker.io docker-compose` (Ubuntu/Debian)

✅ **Puerto 3000 disponible** (frontend)
✅ **Puerto 5432 disponible** (base de datos)
✅ **Puerto 8080 disponible** (backend)

---

## 🚀 Paso 1: Iniciar los Servicios

### En Windows/Mac:
1. Abre **Docker Desktop**
2. Abre **Terminal/PowerShell** en la carpeta del proyecto
3. Ejecuta:
```bash
docker-compose up
```

### En Linux:
```bash
sudo docker-compose up
```

**Espera 3-5 minutos** (primera vez descarga las imágenes)

---

## ✅ Validar que Todo Funciona

Cuando veas estos mensajes, está todo corriendo:

```
postgres_1  | database system is ready to accept connections
backend_1   | Started Application in 25.340 seconds
nginx_1     | 127.0.0.1 - - [11/Jun/2026:20:00:00 +0000] "GET / HTTP/1.1" 200 2847
```

### Prueba cada servicio:

#### 🌐 Frontend
Abre: http://localhost:3000
- Deberías ver la página principal de VexalStock

#### 📊 Backend API
Abre: http://localhost:8080/api/products
- Deberías ver una lista JSON de productos

#### 🗄️ Base de Datos
Acceso directo (si tienes psql instalado):
```bash
psql -h localhost -U postgres -d vexalstock -c "SELECT COUNT(*) FROM products;"
```

---

## 🛑 Detener los Servicios

En la terminal donde ejecutaste `docker-compose up`:

**Presiona:** `Ctrl + C`

O en otra terminal:
```bash
docker-compose down
```

---

## 🔧 Comandos Útiles

### Ver logs en tiempo real
```bash
docker-compose logs -f
```

### Ver solo logs del backend
```bash
docker-compose logs -f backend
```

### Ver solo logs del frontend
```bash
docker-compose logs -f nginx
```

### Ejecutar comandos en el contenedor backend
```bash
docker-compose exec backend bash
```

### Limpiar todo (incluyendo base de datos)
```bash
docker-compose down -v
```
⚠️ **CUIDADO:** Esto elimina los datos de la BD. Usa solo si necesitas un reset total.

---

## 📁 Volúmenes (Datos Persistentes)

Los siguientes directorios se guardan incluso si reinicia Docker:

- **PostgreSQL**: `/var/lib/postgresql/data` → `postgres_data` volume
- **Uploads**: `./backend/uploads` → Los archivos subidos quedan en tu computador

Esto significa: Si paras Docker y lo vuelves a iniciar, **tu base de datos y archivos siguen ahí**.

---

## 🐛 Solución de Problemas

### ❌ "Port 3000 is already in use"
```bash
# Opción 1: Detener lo que usa el puerto
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>

# Opción 2: Cambiar el puerto en docker-compose.yml
# Cambiar línea: "3000:3000" → "3001:3000"
```

### ❌ "Cannot connect to Docker daemon"
```bash
# Windows/Mac: Asegúrate que Docker Desktop está abierto

# Linux: Inicia el servicio
sudo systemctl start docker
```

### ❌ "Database connection refused"
```bash
# Los contenedores necesitan tiempo para iniciar. Espera 30 segundos y recarga.
# Si sigue fallando, reinicia:
docker-compose down
docker-compose up
```

### ❌ El frontend ve error "Connection refused" en API
```bash
# Verifica que el backend esté corriendo:
docker-compose ps

# Si el backend está "Exit", revisa los logs:
docker-compose logs backend
```

---

## 📦 Transferir el Proyecto a Otro Computador

### Opción A: Comprimir (Recomendado)
```bash
# En el computador actual
zip -r VexalStock.zip . -x "*/node_modules/*" "*/target/*" ".git/*" "*.env"

# Transferir VexalStock.zip al otro computador, luego:
unzip VexalStock.zip
cd VexalStock
docker-compose up
```

**Tamaño esperado**: ~500 MB (sin node_modules, target, .git)

### Opción B: Git
```bash
git push origin main
# En el otro computador:
git clone <tu-repo>
cd VexalStock
docker-compose up
```

---

## 🔐 Seguridad (IMPORTANTE para Producción)

⚠️ **Las credenciales están en `docker-compose.yml`:**
```yaml
POSTGRES_PASSWORD: 12345
```

### Para Producción:
1. **Cambiar credenciales**:
   - Generar contraseña fuerte
   - Actualizar `docker-compose.yml`

2. **Usar variables de entorno**:
   ```bash
   # Crear .env
   POSTGRES_PASSWORD=tu-contraseña-segura
   SPRING_DB_PASSWORD=${POSTGRES_PASSWORD}
   ```
   
   Luego en `docker-compose.yml`:
   ```yaml
   POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
   ```

3. **SSL en Nginx**:
   Actualizar `nginx.conf` con certificados SSL (Let's Encrypt)

---

## 📊 Monitoreo

### Ver recursos usados por Docker
```bash
docker stats
```

### Ver volúmenes
```bash
docker volume ls
docker volume inspect vexalstock_postgres_data
```

---

## ✨ Tips Finales

✅ **Primera ejecución**: Espera 5 minutos (descarga imágenes de internet)
✅ **Ejecuciones posteriores**: Inicia en ~30 segundos
✅ **Sin instalar**: Node, npm, Java, Maven, PostgreSQL (todo en Docker)
✅ **Backup**: Comprime `backend/uploads` y el volumen de PostgreSQL regularmente

---

¿Algo no funciona? Revisa los logs con:
```bash
docker-compose logs
```

¡Éxito! 🚀
