# Script para configurar e executar o projeto Angular
# Execute este script no PowerShell como Administrador

Write-Host "=== Configuração do Event Manager Frontend ===" -ForegroundColor Green

# Verificar se Node.js está instalado
function Test-NodeJS {
    try {
        $version = node --version
        Write-Host "Node.js encontrado: $version" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "Node.js não encontrado!" -ForegroundColor Red
        return $false
    }
}

# Verificar se Angular CLI está instalado
function Test-AngularCLI {
    try {
        $version = ng version --skip-confirmation 2>$null
        Write-Host "Angular CLI encontrado" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "Angular CLI não encontrado!" -ForegroundColor Red
        return $false
    }
}

# Instalar Angular CLI
function Install-AngularCLI {
    Write-Host "Instalando Angular CLI..." -ForegroundColor Yellow
    npm install -g @angular/cli
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Angular CLI instalado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "Erro ao instalar Angular CLI!" -ForegroundColor Red
        exit 1
    }
}

# Instalar dependências do projeto
function Install-Dependencies {
    Write-Host "Instalando dependências do projeto..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Dependências instaladas com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "Erro ao instalar dependências!" -ForegroundColor Red
        exit 1
    }
}

# Função principal
function Main {
    # Verificar se estamos no diretório correto
    if (!(Test-Path "package.json")) {
        Write-Host "Execute este script no diretório frontend!" -ForegroundColor Red
        exit 1
    }

    # Verificar Node.js
    if (!(Test-NodeJS)) {
        Write-Host ""
        Write-Host "Por favor, instale o Node.js primeiro:" -ForegroundColor Yellow
        Write-Host "1. Acesse: https://nodejs.org/" -ForegroundColor Cyan
        Write-Host "2. Baixe a versão LTS (18.x ou superior)" -ForegroundColor Cyan
        Write-Host "3. Execute a instalação" -ForegroundColor Cyan
        Write-Host "4. Reinicie o PowerShell e execute este script novamente" -ForegroundColor Cyan
        exit 1
    }

    # Verificar Angular CLI
    if (!(Test-AngularCLI)) {
        Install-AngularCLI
    }

    # Instalar dependências
    Install-Dependencies

    Write-Host ""
    Write-Host "=== Configuração concluída! ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Para executar o projeto:" -ForegroundColor Yellow
    Write-Host "  npm start" -ForegroundColor Cyan
    Write-Host "  ou" -ForegroundColor Yellow
    Write-Host "  ng serve" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "A aplicação estará disponível em: http://localhost:4200" -ForegroundColor Cyan
    Write-Host ""
    
    # Perguntar se quer executar agora
    $response = Read-Host "Deseja executar o projeto agora? (s/n)"
    if ($response -eq "s" -or $response -eq "S" -or $response -eq "yes" -or $response -eq "y") {
        Write-Host "Iniciando o servidor de desenvolvimento..." -ForegroundColor Yellow
        ng serve --open
    }
}

# Executar função principal
Main
