# Plataforma Educativa - Guía de Instalación

## Requisitos Previos

- Node.js 18+ instalado
- Cuenta en Supabase (gratuita en https://supabase.com)
- Clave API de Anthropic (Claude) en https://console.anthropic.com

## 1. Clonar y Configurar el Proyecto

```bash
# El proyecto ya está creado en esta carpeta
cd plataforma-educativa

# Instalar dependencias (si no estén instaladas)
npm install
```

## 2. Configurar Supabase

### Crear un Proyecto en Supabase

1. Ve a https://supabase.com
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto (elige región cercana a Chile)
4. Espera a que se inicialice

### Crear la Base de Datos

1. En el dashboard de Supabase, ve a "SQL Editor"
2. Copia todo el contenido del archivo `database/schema.sql`
3. Pega en una nueva query en SQL Editor
4. Ejecuta el query
5. Espera a que se creen todas las tablas

### Obtener las Credenciales

1. Ve a "Project Settings" → "API"
2. Copia:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)

## 3. Configurar Variables de Entorno

1. Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

2. Edita `.env.local` con tus valores:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui

# Claude API
ANTHROPIC_API_KEY=sk-ant-...tu_clave_api_aqui

# App
NEXT_PUBLIC_APP_NAME=Plataforma Educativa
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4. Iniciar la Aplicación

```bash
npm run dev
```

Abre en tu navegador: http://localhost:3000

## 5. Crear un Usuario Administrador (Docente)

### Opción A: Via Supabase Auth

1. Ve a tu proyecto Supabase
2. Sección "Authentication" → "Users"
3. Crea un nuevo usuario con:
   - Email: tu_email@ejemplo.com
   - Password: contraseña_segura

### Opción B: Registrarse en la App

1. En http://localhost:3000/register
2. Completa el formulario
3. Por defecto se crea como "estudiante"
4. Para cambiar a "docente", ve a Supabase → Table "users" → edita tu registro

## 6. Estructura de la Aplicación

```
plataforma-educativa/
├── src/
│   ├── app/              # Páginas y rutas
│   │   ├── (auth)/       # Login y Register
│   │   ├── (student)/    # Vistas para estudiantes
│   │   ├── (teacher)/    # Vistas para docentes
│   │   └── api/          # Rutas API
│   ├── components/       # Componentes React reutilizables
│   ├── hooks/           # Custom hooks (useAuth, etc)
│   ├── lib/             # Utilidades (Supabase, Claude API, types)
│   └── styles/          # CSS global
├── database/            # Script SQL de esquema
└── .env.local          # Variables de entorno (NO VERSIONADO)
```

## 7. Funcionalidades Principales

### Para Docentes

- ✅ Dashboard de cuestionarios
- ✅ Asistente IA para generar preguntas
- ✅ Gestión de actividades
- ✅ Análisis de progreso
- ✅ Mensajería con estudiantes

### Para Estudiantes

- ✅ Ver cuestionarios asignados
- ✅ Responder quiz
- ✅ Ver ranking
- ✅ Recibir mensajes
- ✅ Historial de actividades

## 8. Próximos Pasos

### Fase 2: Mejorar Sistema de Quiz

- [ ] Crear página de crear/editar cuestionarios
- [ ] Implementar reproductor de quiz con temporizador
- [ ] Sistema de puntuación automática
- [ ] Guardado de respuestas

### Fase 3: Mejorar Asistente IA

- [ ] Guardar preguntas generadas en BD
- [ ] Generador de retroalimentación
- [ ] Evaluación IA de ensayos

### Fase 4: Sistema de Ranking y Recompensas

- [ ] Tabla de ranking en tiempo real
- [ ] Crear premios personalizados
- [ ] Sistema de canje de puntos

### Fase 5: Mensajería

- [ ] Chat en tiempo real (Supabase Realtime)
- [ ] Notificaciones
- [ ] Historial de mensajes

### Fase 6: Análisis

- [ ] Dashboard con gráficos
- [ ] Reportes de estudiantes
- [ ] Exportar a CSV

## 9. Troubleshooting

### Error: "NEXT_PUBLIC_SUPABASE_URL not configured"

- Verifica que el archivo `.env.local` existe
- Asegúrate de que las variables están configuradas correctamente
- Reinicia el servidor: `npm run dev`

### Error al conectar a Supabase

- Verifica que el URL y la API key son correctas
- Que no haya espacios en blanco
- Que el proyecto de Supabase esté activo

### Error al usar Claude API

- Verifica que la API key de Anthropic es válida
- Que tenga acceso a modelo "claude-3-5-sonnet-20241022"
- Comprueba el saldo de créditos en https://console.anthropic.com

## 10. Despliegue en Producción

Para desplegar en Vercel:

```bash
npm run build

# Verificar que compile sin errores
```

Luego:

1. Crea un repositorio en GitHub
2. Conecta con Vercel
3. Agrega las variables de entorno en Vercel
4. Despliega

## Recursos

- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación Supabase](https://supabase.com/docs)
- [Documentación Claude API](https://docs.anthropic.com)
- [Tailwind CSS](https://tailwindcss.com)

## Soporte

Para preguntas o problemas:
1. Revisa este archivo
2. Consulta la documentación de Supabase
3. Verifica los logs del servidor
