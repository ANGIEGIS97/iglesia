# Su Gracia Es Mayor - Diseño Web Iglesia

## 🛠️ Tecnologías

### Frontend
- Vue.js 3 - Framework JavaScript progresivo
- Tailwind CSS - Framework CSS utilitario
- Astro - Generador de sitios estáticos
- Swiper - Componente de carrusel moderno
- ProseMirror - Editor de texto enriquecido
- FontAwesome - Librería de iconos

### Backend y Servicios
- Firebase
  - Autenticación de usuarios
  - Base de datos Firestore
  - Cloud Functions
- Google AI (Gemini) - Generación de contenido con IA
- API de Unsplash - Búsqueda de imágenes

## ✨ Características

### Gestión de Usuarios
- Autenticación de usuarios
- Control de acceso basado en roles
- Perfiles de usuario
- Gestión de contraseñas

### Gestión de Contenido
- Anuncios dinámicos con texto enriquecido
- Calendario de eventos
- Horarios de servicios
- Generación automática de contenido con IA
- Gestión de imágenes

### Gestión de Eventos
- Crear/Editar/Eliminar eventos
- Tipos y categorías de eventos
- Localización con Google Maps
- Seguimiento de asistencia
- Eventos recurrentes

### Interfaz
- Diseño responsivo
- Tema Claro/Oscuro
- Transiciones animadas
- Carruseles interactivos
- Fuentes y estilos personalizados

## 🚀 Inicio Rápido

1. Clonar el repositorio
```bash
git clone <url-repositorio>
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
```bash
cp .env.example .env
```

4. Iniciar servidor de desarrollo
```bash
npm run dev
```

## 📝 Variables de Entorno

Crear un archivo `.env`:
```bash
FIREBASE_API_KEY=tu_api_key
FIREBASE_AUTH_DOMAIN=tu_dominio
FIREBASE_PROJECT_ID=tu_project_id
FIREBASE_STORAGE_BUCKET=tu_bucket
FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
FIREBASE_APP_ID=tu_app_id
```

## 🛡️ Configuración de Firebase

Este proyecto utiliza Firebase para servicios backend. Necesitarás:

1. Crear un proyecto en Firebase
2. Habilitar Autenticación con email/contraseña
3. Configurar base de datos Firestore
4. Establecer reglas de seguridad
5. Agregar tu configuración de Firebase al `.env`

## 📦 Estructura del Proyecto

```
├── public/          # Recursos estáticos
├── src/
│   ├── components/  # Componentes Vue
│   ├── layouts/     # Layouts de página
│   ├── lib/         # Utilidades y APIs
│   ├── middleware/  # Middleware de autenticación
│   └── pages/       # Páginas de rutas
```

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama de feature
3. Hacer commit de cambios
4. Push a la rama
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
