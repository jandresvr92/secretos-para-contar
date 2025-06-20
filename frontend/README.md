# SPC Frontend - Secretos Para Contar

Frontend de la aplicación de biblioteca digital educativa "Secretos Para Contar" construido con React, TypeScript y Tailwind CSS.

## 🚀 Características

- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **React Router** para navegación
- **Zustand** para manejo de estado
- **Lucide React** para iconos
- **Vite** como bundler
- **Diseño responsive** y moderno
- **Autenticación** con roles de usuario
- **Biblioteca digital** con búsqueda y filtros

## 📁 Estructura del Proyecto

```
frontend/
├── public/
│   └── image.png          # Logo de la aplicación
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── Auth/         # Componentes de autenticación
│   │   ├── BookCard/     # Tarjetas de libros
│   │   ├── BookDetail/   # Detalles de libros
│   │   ├── Layout/       # Componentes de layout
│   │   ├── MediaPlayer/  # Reproductor de media
│   │   └── UI/           # Componentes UI básicos
│   ├── pages/            # Páginas de la aplicación
│   ├── store/            # Estado global con Zustand
│   ├── App.tsx           # Componente principal
│   ├── main.tsx          # Punto de entrada
│   └── index.css         # Estilos globales
├── index.html            # Template HTML
├── package.json          # Dependencias y scripts
├── vite.config.ts        # Configuración de Vite
├── tailwind.config.js    # Configuración de Tailwind
└── README.md             # Esta documentación
```

## 🛠️ Instalación y Configuración

### 1. Instalar dependencias
```bash
cd frontend
npm install
```

### 2. Iniciar servidor de desarrollo
```bash
npm run dev
```

### 3. Construir para producción
```bash
npm run build
```

### 4. Vista previa de producción
```bash
npm run preview
```

## 🎨 Diseño y Marca

### Colores de Marca
- **Naranja Primario**: `#FA4616` (Pantone 172 C)
- **Azul Marino**: `#002847`
- **Blanco**: `#FFFFFF`

### Tipografía
- **Fuente Principal**: Be Vietnam Pro
- **Pesos**: 300, 400, 500, 600, 700, 800

### Componentes de Diseño
- Bordes redondeados (rounded-xl, rounded-2xl)
- Sombras suaves (shadow-soft, shadow-brand)
- Gradientes de marca
- Animaciones fluidas
- Diseño responsive

## 📱 Páginas y Funcionalidades

### Páginas Principales
- **Home** (`/`) - Biblioteca principal con búsqueda y filtros
- **Login** (`/login`) - Inicio de sesión
- **Register** (`/register`) - Registro de usuarios
- **Dashboard** (`/dashboard`) - Panel de administración (solo admin)
- **Donate** (`/donate`) - Página de donaciones

### Funcionalidades
- **Autenticación** con roles (admin, teacher, student, external)
- **Búsqueda** de libros por título, descripción o categoría
- **Filtros** por categoría
- **Visualización** de detalles de libros
- **Descarga** de PDFs
- **Reproducción** de audio y video
- **Gestión** de libros (admin/teacher)
- **Estadísticas** y analytics

## 🔐 Autenticación

### Cuentas de Prueba
- **Admin**: admin@spc.org / password123
- **Docente**: teacher@spc.org / password123
- **Estudiante**: student@spc.org / password123
- **Externo**: external@spc.org / password123

## 🌐 API Integration

El frontend se conecta al backend en `http://localhost:3001` para:
- Autenticación de usuarios
- Gestión de libros
- Estadísticas
- Upload de archivos

## 📦 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de producción
- `npm run lint` - Linter de código

## 🚀 Despliegue

### Variables de Entorno
```env
API_URL=http://localhost:3001
```

### Construcción
```bash
npm run build
```

Los archivos de producción se generan en la carpeta `dist/`.

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