# 📚 Plataforma Educativa Integral

Una plataforma web moderna y escalable para educación ciudadana en enseñanza media, diseñada para 200+ estudiantes con características avanzadas como cuestionarios interactivos, asistente IA, sistema de ranking y análisis de progreso.

## ✨ Características Principales

### Para Docentes
- 🎓 **Crear Cuestionarios**: Crea evaluaciones con múltiples tipos de preguntas
- 🤖 **Asistente IA**: Genera preguntas automáticamente con Claude
- 📊 **Análisis**: Visualiza el progreso académico de tus estudiantes
- 💬 **Mensajería**: Comunícate directamente con estudiantes
- 📝 **Gestión de Actividades**: Crea tareas, proyectos e investigaciones
- 📥 **Importar Estudiantes**: Carga 200+ estudiantes desde CSV

### Para Estudiantes
- ✅ **Responder Cuestionarios**: Quiz con retroalimentación instantánea
- 🏆 **Ranking**: Compite con tus compañeros en tiempo real
- 💰 **Canjear Recompensas**: Usa puntos para obtener reconocimientos
- 📚 **Historial**: Acceso a todas tus actividades completadas
- 📧 **Mensajes**: Recibe comunicación del docente

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Next.js 16 + React 18 + TypeScript |
| **Estilos** | Tailwind CSS 3 |
| **Backend** | API Routes (Next.js) + Node.js |
| **Base de Datos** | Supabase (PostgreSQL) |
| **IA** | Claude API (Anthropic) |
| **Hosting** | Vercel (recommended) |

## 🚀 Inicio Rápido

### 1. Requisitos
- Node.js 18+
- Cuenta en Supabase (gratis)
- Clave API de Claude

### 2. Configuración
```bash
npm install
cp .env.example .env.local
# Configura variables en .env.local
```

### 3. Iniciar
```bash
npm run dev
```

Abre http://localhost:3000

**Ver [SETUP.md](./SETUP.md) para guía detallada**

## 📁 Estructura

```
src/
├── app/
│   ├── (auth)/          # Login/Register
│   ├── (student)/       # Vistas estudiantes
│   ├── (teacher)/       # Vistas docentes
│   └── api/             # Rutas API
├── components/          # Componentes React
├── hooks/              # Custom hooks
├── lib/                # Utilitarios
└── styles/             # CSS global
```

## 🔐 Seguridad

- Autenticación segura con Supabase
- Autorización por roles
- Validación de entrada
- Variables sensibles en `.env.local`

## 📝 Licencia

Propiedad de la institución educativa. Uso educativo.

---

**¿Problemas?** Ver [SETUP.md](./SETUP.md#9-troubleshooting)
