# 🔧 Guía Paso a Paso: Configurar Supabase

## ✅ PASO 1: Crear Cuenta en Supabase (2 minutos)

### 1.1 Abre tu navegador y ve a:
```
https://supabase.com
```

### 1.2 Haz clic en **"Start your project"** o **"Sign Up"**

### 1.3 Elige una opción de registro:
- ✅ **Recomendado:** Con tu cuenta de GitHub (más rápido)
- O con email + contraseña

### 1.4 Verifica tu email si es necesario

---

## ✅ PASO 2: Crear un Proyecto (1 minuto)

### 2.1 Una vez dentro, haz clic en **"New Project"**

### 2.2 Rellena los datos:
```
Nombre del Proyecto:     "plataforma-educativa"
Contraseña BD:           "Pon una contraseña fuerte"
                         (la necesitarás después)
Región:                  "South America (São Paulo)" o "USA East"
Pricing Plan:            "Free" (gratuito, suficiente para pruebas)
```

### 2.3 Haz clic en **"Create new project"**

### ⏳ Espera a que se inicialice (~1 minuto)

---

## ✅ PASO 3: Crear la Base de Datos (3 minutos)

### 3.1 Una vez cargado, ve a **"SQL Editor"** (lado izquierdo)

### 3.2 Haz clic en **"New Query"**

### 3.3 Abre el archivo:
```
C:\Users\ivanv\OneDrive\Desktop\Nueva carpeta\plataforma-educativa\database\schema.sql
```

### 3.4 Copia TODO el contenido del archivo

### 3.5 Pégalo en el editor SQL de Supabase

### 3.6 Haz clic en **"Run"** (botón verde arriba)

### ✅ Si ves "✓ Success" → ¡Listo! La BD está creada

---

## ✅ PASO 4: Obtener las Credenciales (2 minutos)

### 4.1 En Supabase, ve a **"Project Settings"** (engranaje abajo a la izquierda)

### 4.2 Haz clic en la pestaña **"API"**

### 4.3 Copia estos valores:

#### **NEXT_PUBLIC_SUPABASE_URL**
```
Busca en la sección "Project URL"
Se ve así: https://xxxxxxxxxxx.supabase.co

CÓPIALO COMPLETO (incluyendo https://)
```

#### **NEXT_PUBLIC_SUPABASE_ANON_KEY**
```
Busca en la sección "anon public"
Es una cadena larga de letras y números

CÓPIALO COMPLETO
```

---

## ✅ PASO 5: Configurar Variables de Entorno (1 minuto)

### 5.1 Abre tu carpeta del proyecto:
```
C:\Users\ivanv\OneDrive\Desktop\Nueva carpeta\plataforma-educativa
```

### 5.2 Busca el archivo `.env.local`
- Si NO existe, copia `.env.example` y renómbralo a `.env.local`

### 5.3 Abre `.env.local` con Bloc de Notas (Click derecho → Editar)

### 5.4 Reemplaza los valores:

```env
# Antes (así se ve originalmente):
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Después (con TUS valores reales):
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...
ANTHROPIC_API_KEY=sk-ant-v7-xxxxxxxxxxxxxxxx...
```

### 5.5 **Guarda el archivo** (Ctrl+S)

⚠️ **IMPORTANTE:** Este archivo contiene secretos, ¡NUNCA lo compartas ni lo subas a GitHub!

---

## ✅ PASO 6: Obtener Clave de Claude API (2 minutos)

### 6.1 Ve a:
```
https://console.anthropic.com
```

### 6.2 Si no tienes cuenta:
- Haz clic en **"Sign Up"**
- Registrate con tu email
- Verifica tu correo

### 6.3 Una vez dentro, ve a **"API Keys"** (lado izquierdo)

### 6.4 Haz clic en **"Create Key"**

### 6.5 Dale un nombre:
```
"plataforma-educativa"
```

### 6.6 Copia la clave (empieza con `sk-ant-`)

### 6.7 Pégala en `.env.local`:
```env
ANTHROPIC_API_KEY=sk-ant-v7-xxxxxxxxxxxxxxxx...
```

---

## ✅ PASO 7: Verificar que Todo Funciona (2 minutos)

### 7.1 Abre PowerShell en la carpeta del proyecto:
```
Windows: Presiona Shift + Click derecho → "Abrir PowerShell aquí"
```

### 7.2 Ejecuta:
```bash
npm run dev
```

### 7.3 Espera a ver:
```
✓ Ready in 682ms
- Local:   http://localhost:3001
```

### 7.4 Abre tu navegador y ve a:
```
http://localhost:3001
```

### ✅ Si ves la página de inicio → ¡Está funcionando!

---

## 🔐 Verificación Final: Probar Login

### 8.1 En la página, haz clic en **"Ingresar"**

### 8.2 Haz clic en **"Registrarse"**

### 8.3 Completa el formulario:
```
Nombre:      Juan Pérez
Email:       prueba@ejemplo.com
Contraseña:  Contraseña123
```

### 8.4 Haz clic en **"Registrarse"**

### ✅ Si funciona → ¡Todo está configurado correctamente!

---

## ❌ Si Algo Falla

### Error: "SUPABASE_URL not configured"
**Solución:** Verifica que el archivo `.env.local` esté en la raíz del proyecto (no en subcarpetas)

### Error: "Invalid API key"
**Solución:** Copia exactamente la clave, sin espacios al inicio ni al final

### Error: "Cannot connect to database"
**Solución:** 
1. Verifica que el schema SQL se ejecutó exitosamente
2. Comprueba que copiaste la URL correcta

### Puerto 3001 ya está en uso
**Solución:**
```bash
npm run dev -- -p 3002
```

---

## 📋 Checklist Final

- [ ] Cuenta de Supabase creada
- [ ] Proyecto creado
- [ ] Schema SQL ejecutado (¡Importante!)
- [ ] NEXT_PUBLIC_SUPABASE_URL copiada
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY copiada
- [ ] ANTHROPIC_API_KEY copiada
- [ ] .env.local configurado
- [ ] npm run dev funcionando
- [ ] Página carga en http://localhost:3001
- [ ] Login/Registro funciona

---

## 🎉 ¡Listo!

Una vez completados todos estos pasos, tu plataforma estará **100% funcional** y lista para:
- ✅ Crear cuestionarios
- ✅ Responder como estudiante
- ✅ Ver ranking
- ✅ Usar el asistente IA
- ✅ Enviar mensajes
- ✅ Canjear recompensas

---

## 💡 Tips Útiles

### Para crear datos de prueba:
1. Registra un usuario como "Docente"
2. En Supabase → Tabla "users" → Edita el registro
3. Cambia "rol" de "student" a "teacher"
4. ¡Ahora eres docente!

### Para crear estudiantes rápidamente:
1. Ve a `/teacher/import-students`
2. Descarga el archivo CSV de ejemplo
3. Complétalo con tus estudiantes
4. Súbelo

### Para generar preguntas con IA:
1. Como docente, ve a `/teacher/ai-assistant`
2. Ingresa un tema (ej: "Democracia")
3. ¡Claude genera preguntas automáticamente!

---

**¿Necesitas ayuda en algún paso? Pregúntame y te guío!**
