@echo off
REM Script de configuración para Plataforma Educativa en Windows

color 0A
cls
echo.
echo ================================================================================
echo  ^>^> Configurar Plataforma Educativa
echo ================================================================================
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ERROR: Node.js no está instalado
    echo Descárgalo en: https://nodejs.org
    pause
    exit /b 1
)

REM Ejecutar el script de configuración
echo Iniciando configuración...
echo.
node setup.js

if errorlevel 1 (
    color 0C
    echo.
    echo ERROR: Algo salió mal en la configuración
    pause
    exit /b 1
)

echo.
color 0A
echo ================================================================================
echo  ^>^> Configuración completada exitosamente
echo ================================================================================
echo.
echo Ahora ejecuta: npm run dev
echo.
pause
