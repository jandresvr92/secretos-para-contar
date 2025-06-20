# SPC Backend API - Secretos Para Contar

Backend completo en Node.js para la aplicación de biblioteca digital educativa "Secretos Para Contar".

## 🚀 Características

- **API REST completa** con autenticación JWT
- **Base de datos SQLite** con esquema robusto
- **Sistema de roles** (admin, teacher, student, external)
- **Upload de archivos** (PDFs, imágenes, audio, video)
- **Estadísticas detalladas** y analytics
- **Validación de datos** con Joi
- **Middleware de seguridad** con Helmet y CORS
- **Rate limiting** para prevenir abuso
- **Logging** con Morgan

## 📁 Estructura del Proyecto

```
backend/
├── database/
│   ├── init.js          # Configuración e inicialización de BD
│   └── spc.db          # Base de datos SQLite (generada automáticamente)
├── middleware/
│   ├── auth.js         # Autenticación y autorización
│   ├── validation.js   # Validación de datos
│   ├── errorHandler.js # Manejo de errores
│   └── notFound.js     # Middleware 404
├── routes/
│   ├── auth.js         # Rutas de autenticación
│   ├── books.js        # CRUD de libros
│   ├── users.js        # Gestión de usuarios
│   ├── stats.js        # Estadísticas y analytics
│   └── upload.js       # Upload de archivos
├── scripts/
│   └── seedDatabase.js # Script para poblar BD inicial
├── uploads/            # Archivos subidos (generado automáticamente)
│   ├── books/         # PDFs de libros
│   ├── covers/        # Imágenes de portada
│   ├── audio/         # Archivos de audio
│   └── video/         # Archivos de video
├── .env               # Variables de entorno
├── .env.example       # Ejemplo de variables de entorno
├── package.json       # Dependencias y scripts
├── server.js          # Servidor principal
└── README.md          # Esta documentación
```

## 🛠️ Instalación y Configuración

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

### 3. Inicializar base de datos
```bash
npm run seed
```

### 4. Iniciar servidor
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:3001`

## 📊 Base de Datos

### Esquema de Tablas

#### users
- `id` - ID único del usuario
- `name` - Nombre completo
- `email` - Email único
- `password` - Contraseña hasheada
- `role` - Rol (admin, teacher, student, external)
- `is_active` - Estado activo/inactivo
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

#### books
- `id` - ID único del libro
- `title` - Título del libro
- `description` - Descripción
- `cover_image` - URL de la portada
- `file_url` - URL del archivo PDF
- `audio_url` - URL del audio (opcional)
- `video_url` - URL del video (opcional)
- `category` - Categoría del libro
- `is_active` - Estado activo/inactivo
- `downloads` - Contador de descargas
- `plays` - Contador de reproducciones
- `created_by` - ID del usuario creador
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

#### user_book_interactions
- `id` - ID único de la interacción
- `user_id` - ID del usuario
- `book_id` - ID del libro
- `interaction_type` - Tipo (download, play_audio, play_video, view)
- `created_at` - Fecha de la interacción

#### donations
- `id` - ID único de la donación
- `donor_name` - Nombre del donante
- `donor_email` - Email del donante
- `amount` - Cantidad donada
- `donation_type` - Tipo (once, monthly)
- `status` - Estado (pending, completed, failed)
- `created_at` - Fecha de la donación

## 🔐 Autenticación

### Usuarios de Prueba
- **Admin**: admin@spc.org / password123
- **Teacher**: teacher@spc.org / password123
- **Student**: student@spc.org / password123
- **External**: external@spc.org / password123

### JWT Token
- Incluir en headers: `Authorization: Bearer <token>`
- Expiración: 7 días (configurable)

## 📡 Endpoints de la API

### Autenticación (`/api/auth`)
- `POST /register` - Registrar usuario
- `POST /login` - Iniciar sesión
- `GET /profile` - Obtener perfil (requiere auth)
- `POST /refresh` - Renovar token (requiere auth)

### Libros (`/api/books`)
- `GET /` - Listar libros (público)
- `GET /:id` - Obtener libro específico
- `POST /` - Crear libro (admin/teacher)
- `PUT /:id` - Actualizar libro (admin/teacher)
- `PATCH /:id/toggle-active` - Activar/desactivar libro (admin/teacher)
- `POST /:id/interact` - Registrar interacción
- `GET /meta/categories` - Obtener categorías

### Usuarios (`/api/users`) - Solo Admin
- `GET /` - Listar usuarios
- `GET /:id` - Obtener usuario específico
- `PUT /:id` - Actualizar usuario
- `PATCH /:id/password` - Cambiar contraseña
- `PATCH /:id/toggle-active` - Activar/desactivar usuario
- `GET /:id/activity` - Obtener actividad del usuario

### Estadísticas (`/api/stats`)
- `GET /` - Estadísticas generales (público)
- `GET /admin` - Estadísticas de admin (solo admin)
- `GET /user` - Estadísticas del usuario (requiere auth)

### Upload (`/api/upload`) - Admin/Teacher
- `POST /single` - Subir archivo único
- `POST /book` - Subir archivos de libro (PDF, portada, audio, video)
- `DELETE /:filename` - Eliminar archivo
- `GET /info/:filename` - Información del archivo

## 🔒 Seguridad

- **Helmet**: Headers de seguridad
- **CORS**: Control de acceso entre dominios
- **Rate Limiting**: Límite de solicitudes por IP
- **JWT**: Tokens seguros para autenticación
- **bcrypt**: Hash seguro de contraseñas
- **Validación**: Joi para validar datos de entrada

## 📈 Monitoreo

- **Health Check**: `GET /health`
- **Logging**: Morgan para logs de requests
- **Error Handling**: Middleware centralizado de errores

## 🚀 Despliegue

### Variables de Entorno de Producción
```env
NODE_ENV=production
PORT=3001
JWT_SECRET=tu-secreto-super-seguro-aqui
DATABASE_URL=./database/spc.db
FRONTEND_URL=https://tu-dominio.com
```

### Comandos de Producción
```bash
# Instalar dependencias de producción
npm ci --only=production

# Inicializar BD
npm run seed

# Iniciar servidor
npm start
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles.

---

**Desarrollado con ❤️ para Secretos Para Contar**