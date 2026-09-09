#!/usr/bin/env node

/**
 * Script de configuración de Supabase para Plataforma Educativa
 * Uso: node setup.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(color, text) {
  console.log(`${colors[color]}${text}${colors.reset}`);
}

function separator() {
  console.log('\n' + '='.repeat(60) + '\n');
}

async function main() {
  log('cyan', '╔════════════════════════════════════════════════════════════╗');
  log('cyan', '║  ⚙️  Configurar Plataforma Educativa                      ║');
  log('cyan', '╚════════════════════════════════════════════════════════════╝');

  separator();

  const envPath = path.join(__dirname, '.env.local');
  const envExamplePath = path.join(__dirname, '.env.example');

  // PASO 1: Verificar si existe .env.local
  log('bright', '📋 PASO 1: Verificar archivo .env.local');

  if (!fs.existsSync(envPath)) {
    log('yellow', 'ℹ️  .env.local no existe. Creando desde .env.example...');

    if (!fs.existsSync(envExamplePath)) {
      log('red', '❌ Error: No se encontró .env.example');
      rl.close();
      process.exit(1);
    }

    fs.copyFileSync(envExamplePath, envPath);
    log('green', '✅ .env.local creado exitosamente');
  } else {
    log('green', '✅ .env.local ya existe');
  }

  separator();

  // PASO 2: Leer variables actuales
  log('bright', '📖 PASO 2: Verificar credenciales');

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};

  envContent.split('\n').forEach(line => {
    if (line && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key) envVars[key.trim()] = value?.trim() || '';
    }
  });

  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'ANTHROPIC_API_KEY'
  ];

  let allConfigured = true;
  requiredVars.forEach(varName => {
    const value = envVars[varName];
    if (!value || value.includes('_here') || value.startsWith('sk-ant-') === false && varName === 'ANTHROPIC_API_KEY') {
      log('yellow', `⚠️  ${varName}: No configurada`);
      allConfigured = false;
    } else {
      const shortValue = value.substring(0, 20) + '...';
      log('green', `✅ ${varName}: ${shortValue}`);
    }
  });

  separator();

  // PASO 3: Guiar al usuario
  if (!allConfigured) {
    log('bright', '📝 PASO 3: Obtener Credenciales');

    console.log(`
${colors.cyan}${colors.bright}INSTRUCCIONES:${colors.reset}

1. Ve a ${colors.cyan}https://supabase.com${colors.reset}
   - Inicia sesión o crea una cuenta
   - Crea un proyecto llamado "plataforma-educativa"
   - Espera a que se inicialice (~1 min)

2. Configura la base de datos:
   - SQL Editor → New Query
   - Abre: ${colors.yellow}database/schema.sql${colors.reset}
   - Copia TODO el contenido
   - Pégalo en Supabase
   - Haz clic en "Run"
   - ✅ Debe decir "Success"

3. Obtén las credenciales:
   - Project Settings → API
   - Copia "Project URL" (se ve como: https://xxxxx.supabase.co)
   - Copia "anon public" (cadena larga)

4. Obtén la clave de Claude:
   - Ve a ${colors.cyan}https://console.anthropic.com${colors.reset}
   - Crea una cuenta o inicia sesión
   - API Keys → Create Key
   - Copia la clave (empieza con sk-ant-)

${colors.bright}Luego vuelve aquí y pega los valores cuando se te pida.${colors.reset}
    `);

    separator();

    // Pedir credenciales
    console.log(`${colors.bright}Ingresa tus credenciales:${colors.reset}\n`);

    const supabaseUrl = await question(`${colors.cyan}NEXT_PUBLIC_SUPABASE_URL${colors.reset}: `);
    const supabaseKey = await question(`${colors.cyan}NEXT_PUBLIC_SUPABASE_ANON_KEY${colors.reset}: `);
    const anthropicKey = await question(`${colors.cyan}ANTHROPIC_API_KEY${colors.reset}: `);

    // Validar
    if (!supabaseUrl || !supabaseKey || !anthropicKey) {
      log('red', '❌ Error: Todas las credenciales son requeridas');
      rl.close();
      process.exit(1);
    }

    if (!supabaseUrl.includes('supabase.co')) {
      log('red', '❌ Error: URL de Supabase parece incorrecta');
      rl.close();
      process.exit(1);
    }

    if (!anthropicKey.startsWith('sk-ant-')) {
      log('red', '❌ Error: Clave de Claude debe empezar con sk-ant-');
      rl.close();
      process.exit(1);
    }

    // Actualizar .env.local
    let newEnv = envContent
      .replace(/NEXT_PUBLIC_SUPABASE_URL=.*/, `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}`)
      .replace(/NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/, `NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey}`)
      .replace(/ANTHROPIC_API_KEY=.*/, `ANTHROPIC_API_KEY=${anthropicKey}`);

    fs.writeFileSync(envPath, newEnv, 'utf8');

    log('green', '✅ Credenciales guardadas en .env.local');
  }

  separator();

  // PASO 4: Próximos pasos
  log('bright', '🚀 PASO 4: Próximos Pasos');

  console.log(`
${colors.green}✅ Configuración completada!${colors.reset}

Ahora ejecuta:

  ${colors.bright}npm run dev${colors.reset}

Luego abre en tu navegador:

  ${colors.bright}http://localhost:3001${colors.reset}

Prueba registrando un usuario para verificar que todo funciona.

${colors.yellow}Nota:${colors.reset} Si ves errores, verifica:
  1. Que el schema SQL se ejecutó en Supabase (SQL Editor → debería ver tablas)
  2. Que las credenciales están correctas en .env.local
  3. Que no hay espacios extra en las credenciales
  `);

  separator();
  log('green', '¡Listo para empezar! 🎉');

  rl.close();
}

main().catch(err => {
  log('red', `❌ Error: ${err.message}`);
  rl.close();
  process.exit(1);
});
