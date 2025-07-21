# Script PowerShell para versão limpa simples
Write-Host "=== EXECUTANDO VERSAO LIMPA SIMPLES ===" -ForegroundColor Green
Write-Host ""

# Para containers existentes
Write-Host "1. Parando containers..." -ForegroundColor Yellow
docker stop $(docker ps -aq) 2>$null
docker rm $(docker ps -aq) 2>$null

# Constrói e executa
Write-Host "2. Construindo versao simples..." -ForegroundColor Yellow
docker-compose -f docker-compose-simples.yml up --build -d

# Aguarda
Write-Host "3. Aguardando servicos..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Status
Write-Host "4. Status dos containers:" -ForegroundColor Cyan
docker-compose -f docker-compose-simples.yml ps

# Testa URLs
Write-Host ""
Write-Host "=== TESTANDO CONECTIVIDADE ===" -ForegroundColor Green

Write-Host "5. Testando backend..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/events" -Method GET -TimeoutSec 10
    Write-Host "Backend funcionando" -ForegroundColor Green
} catch {
    Write-Host "Backend erro: $_" -ForegroundColor Red
}

Write-Host "6. Testando frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/" -TimeoutSec 10
    Write-Host "Frontend funcionando - Status $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Frontend erro: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== ACESSE AGORA ===" -ForegroundColor Cyan
Write-Host "VERSAO LIMPA SEM ERROS: http://localhost:3000/" -ForegroundColor Green
Write-Host "Rota especifica: http://localhost:3000/events" -ForegroundColor Green
Write-Host "API Backend: http://localhost:8080/api/events" -ForegroundColor Blue
Write-Host ""

# Pergunta sobre logs
$response = Read-Host "Ver logs? (s/N)"
if ($response -eq "s") {
    docker-compose -f docker-compose-simples.yml logs -f
}
