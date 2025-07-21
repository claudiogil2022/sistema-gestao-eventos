@echo off
echo === Verificando instalação do Node.js ===
node --version
if %errorlevel% neq 0 (
    echo ERRO: Node.js não encontrado!
    echo Por favor, instale o Node.js de https://nodejs.org/
    pause
    exit /b 1
)

echo === Node.js encontrado! ===
echo.

echo === Verificando npm ===
npm --version
if %errorlevel% neq 0 (
    echo ERRO: npm não encontrado!
    pause
    exit /b 1
)

echo === npm encontrado! ===
echo.

echo === Instalando Angular CLI ===
npm install -g @angular/cli
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar Angular CLI
    pause
    exit /b 1
)

echo === Instalando dependências do projeto ===
npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependências
    pause
    exit /b 1
)

echo.
echo === Tudo pronto! ===
echo Para executar o projeto, digite: npm start
echo A aplicação estará disponível em: http://localhost:4200
echo.
pause
