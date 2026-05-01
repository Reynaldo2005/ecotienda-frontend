@echo off
cd /d D:\EcoTienda\frontend
echo Instalando dependencias...
call npm.cmd install
echo.
echo Iniciando servidor frontend en puerto 3001...
call npm.cmd run dev -- -p 3001
pause
