# SPC - Secretos Para Contar

Aplicación completa de biblioteca digital educativa que permite a niños y familias acceder a libros, cuentos y recursos educativos de forma gratuita.

## 🌟 Características Principales

- **Biblioteca Digital Completa** con libros en PDF, audio y video
- **Sistema de Autenticación** con roles diferenciados
- **Búsqueda y Filtros Avanzados**
- **Diseño Responsive** y accesible
- **Estadísticas** y analytics
- **Sistema de Notificaciones Toast** para mejor UX

## 🏗️ Arquitectura del Proyecto

```
spc-digital-library/
├── backend-new/           # API Node.js + Express
│   ├── routes/            # Rutas de la API
│   ├── middleware/        # Middleware personalizado
│   ├── database/          # Configuración de BD
│   ├── .env               # Variables de entorno
│   ├── .env.example       # Ejemplo de configuración
│   └── package.json       # Dependencias backend
├── frontend/              # Aplicación React + TypeScript
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── store/         # Estado global (Zustand)
│   │   └── ...
│   ├── public/            # Archivos estáticos
│   ├── .env               # Variables de entorno frontend
│   ├── .env.example       # Ejemplo de configuración
│   └── package.json       # Dependencias frontend
└── README.md              # Esta documentación
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd spc-digital-library
```

### 2. Configurar Variables de Entorno

#### Backend
```bash
cd backend-new
cp .env.example .env
# Editar .env con tus configuraciones si es necesario
```

#### Frontend
```bash
cd frontend
cp .env.example .env
# Editar .env con tus configuraciones si es necesario
```

### 3. Configurar Backend
```bash
cd backend-new
npm install
npm run dev   # Iniciar servidor backend
```

### 4. Configurar Frontend
```bash
cd frontend
npm install
npm run dev   # Iniciar servidor frontend
```

### 5. Acceder a la aplicación
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 👥 Cuentas de Prueba

| Rol | Email | Contraseña | Permisos |
|-----|-------|------------|----------|
| Admin | admin@spc.org | password123 | Gestión completa |
| Docente | teacher@spc.org | password123 | Gestión de libros |
| Estudiante | student@spc.org | password123 | Lectura y descarga |
| Externo | external@spc.org | password123 | Acceso básico |

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **React Router** para navegación
- **Zustand** para estado global
- **Lucide React** para iconos
- **Vite** como bundler

### Backend
- **Node.js** con Express
- **SQLite** como base de datos
- **JWT** para autenticación
- **Bcrypt** para hash de contraseñas
- **Joi** para validación

## 📊 Funcionalidades por Rol

### 👑 Administrador
- Gestión completa de usuarios
- CRUD de libros y contenido
- Acceso a estadísticas avanzadas
- Panel de control completo

### 👨‍🏫 Docente
- Crear y editar libros
- Ver estadísticas básicas
- Gestionar contenido educativo

### 👨‍🎓 Estudiante / Externo
- Navegar biblioteca
- Descargar libros PDF
- Reproducir audio/video
- Buscar y filtrar contenido

## 🎨 Guía de Marca

### Colores Principales
- **Naranja**: `#FA4616` (Color primario)
- **Azul Marino**: `#002847` (Color secundario)
- **Blanco**: `#FFFFFF`

### Tipografía
- **Fuente**: Be Vietnam Pro
- **Pesos**: 300-800

## ⚙️ Configuración de Variables de Entorno

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=./database/spc.db
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=10485760
```

### Frontend (.env)
```env
API_URL=http://localhost:3001
```

## 🚀 Despliegue

### Variables de Entorno de Producción

#### Backend
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=./database/spc.db
JWT_SECRET=tu-secreto-super-seguro-de-produccion
FRONTEND_URL=https://tu-dominio.com
```

#### Frontend
```env
API_URL=https://api.tu-dominio.com
```

### Comandos de Producción
```bash
# Backend
cd backend-new
npm ci --only=production
npm start

# Frontend
cd frontend
npm ci
npm run build
```

## 🎉 Nuevas Características

### Sistema de Notificaciones Toast
- **4 tipos de notificaciones**: success, error, warning, info
- **Auto-dismiss** configurable
- **Botones de acción** interactivos
- **Animaciones suaves** de entrada y salida
- **Posicionamiento inteligente**

### Notificaciones Implementadas
- ✅ **Autenticación**: Login, registro, logout
- ✅ **Gestión de libros**: CRUD operations
- ✅ **Interacciones**: Descargas, reproducciones
- ✅ **Formularios**: Contacto, donaciones
- ✅ **Errores**: Manejo centralizado de errores

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles.

---

**Desarrollado con ❤️ para Secretos Para Contar**

*Llevando educación y literatura a todas las familias*