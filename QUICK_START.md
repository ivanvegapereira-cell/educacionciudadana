# 🚀 Quick Start - Iniciando en 5 Minutos

## 1️⃣ Crear Cuenta en Supabase (2 min)

```
1. Ve a https://supabase.com
2. Crea una cuenta gratis
3. Crea un nuevo proyecto
4. Espera a que se inicialice (≈1 min)
```

## 2️⃣ Crear Base de Datos (1 min)

```
1. En Supabase: SQL Editor → Nueva Query
2. Copia TODO el contenido de: database/schema.sql
3. Pégalo en SQL Editor
4. Click "Run"
5. Espera a que se creen todas las tablas
```

## 3️⃣ Obtener Credenciales (1 min)

```
En Supabase:
1. Project Settings → API
2. Copia:
   - Project URL → NEXT_PUBLIC_SUPABASE_URL
   - anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY
3. Obtén ANTHROPIC_API_KEY en https://console.anthropic.com
```

## 4️⃣ Configurar .env.local (1 min)

```bash
cd plataforma-educativa
cp .env.example .env.local
```

Edita `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=tuurl
NEXT_PUBLIC_SUPABASE_ANON_KEY=tukey
ANTHROPIC_API_KEY=sk-ant-...
```

## 5️⃣ Ejecutar (1 min)

```bash
npm run dev
```

Abre: http://localhost:3000

## 🧪 Probar la Plataforma

### Como Docente:
1. Clic "Registrarse"
2. Crea cuenta (ej: profesor@test.com)
3. En Supabase: `users` table → edita → rol = `teacher`
4. Vuelve a login
5. Dashboard → Crear Cuestionario
6. Agreg preguntas y publica

### Como Estudiante:
1. Clic "Registrarse" con otro email
2. En Supabase: `users` table → edita → rol = `student`
3. Dashboard → Responde el quiz del docente
4. Ve tu ranking

## 📊 Funciones Principales

```
DOCENTES:
✓ Crear quiz con 4 tipos de preguntas
✓ Generar preguntas con IA
✓ Ver ranking de estudiantes
✓ Importar 200+ estudiantes desde CSV
✓ Crear premios/recompensas

ESTUDIANTES:
✓ Responder cuestionarios
✓ Ver ranking en tiempo real
✓ Canjear puntos por recompensas
✓ Ver historial de actividades
✓ Recibir mensajes del docente
```

## ⚠️ Problemas Comunes

**"SUPABASE_URL no configurada"**
→ Revisa que `.env.local` está en la raíz del proyecto

**"Error de conexión a Supabase"**
→ Verifica que las claves están correctas (sin espacios)

**"Puerto 3000 ocupado"**
→ Usa: `npm run dev -- -p 3001`

**"Módulo no encontrado"**
→ Corre: `npm install`

## 📝 Siguiente Paso

Después de configurar:
1. Lee `SETUP.md` para documentación completa
2. Lee `AVANCES.md` para entender qué está hecho
3. Implementa mensajería realtime (siguiente fase)

## 🎓 Estructura del Código

```
src/app/(teacher)    → Páginas para docentes
src/app/(student)    → Páginas para estudiantes
src/app/api          → Rutas API
src/components       → Componentes React
src/lib              → Utilidades
src/hooks            → Custom hooks
database/schema.sql  → Estructura de BD
```

## 🔧 Comandos Útiles

```bash
npm run dev      # Iniciar desarrollo
npm run build    # Compilar producción
npm run lint     # Verificar código
npm run start    # Ejecutar producción
```

## 💡 Tips

- El sistema guarda automáticamente las respuestas
- Los puntos se actualizan en tiempo real
- Las recompensas se crean desde admin
- Puedes editar cuestionarios después de crearlos
- Los estudiantes pueden responder múltiples veces
- El ranking se actualiza al terminar cada quiz

---

**¡Listo! Ahora tienes una plataforma educativa funcional.**

¿Dudas? Revisa SETUP.md o AVANCES.md
