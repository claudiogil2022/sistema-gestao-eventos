# Script PowerShell para executar a versão limpa sem erros de console
Write-Host "=== EXECUTANDO VERSÃO LIMPA SEM ERROS ===" -ForegroundColor Green
Write-Host ""

# Para o docker-compose atual se estiver rodando
Write-Host "1. Parando containers existentes..." -ForegroundColor Yellow
docker-compose down --remove-orphans

# Remove imagens antigas para forçar rebuild
Write-Host "2. Removendo imagens antigas..." -ForegroundColor Yellow
docker image prune -f
docker rmi desafio_frontend -f 2>$null
docker rmi desafio_backend -f 2>$null

# Constrói e executa a versão limpa
Write-Host "3. Construindo versão limpa..." -ForegroundColor Yellow
docker-compose -f docker-compose-clean.yml up --build -d

# Aguarda os serviços ficarem prontos
Write-Host "4. Aguardando serviços ficarem prontos..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verifica status dos containers
Write-Host "5. Status dos containers:" -ForegroundColor Cyan
docker-compose -f docker-compose-clean.yml ps

# Aguarda mais um pouco para garantir que tudo está rodando
Start-Sleep -Seconds 5

# Testa as URLs
Write-Host ""
Write-Host "=== TESTANDO CONECTIVIDADE ===" -ForegroundColor Green

Write-Host "6. Testando backend..." -ForegroundColor Yellow
try {
    $backendResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/events" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend funcionando - $($backendResponse.Count) eventos encontrados" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend não respondeu: $_" -ForegroundColor Red
}

Write-Host "7. Testando frontend..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000/events" -TimeoutSec 10
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend funcionando - Status $($frontendResponse.StatusCode)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend não respondeu: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== INFORMAÇÕES DE ACESSO ===" -ForegroundColor Cyan
Write-Host "🌐 Versão LIMPA (SEM ERROS): http://localhost:3000/events" -ForegroundColor Green
Write-Host "🔧 API Backend: http://localhost:8080/api/events" -ForegroundColor Blue
Write-Host "📊 Angular Original: http://localhost:3000/index.html" -ForegroundColor Yellow
Write-Host ""
Write-Host "=== LOGS EM TEMPO REAL ===" -ForegroundColor Cyan
Write-Host "Para ver logs: docker-compose -f docker-compose-clean.yml logs -f" -ForegroundColor Gray
Write-Host "Para parar: docker-compose -f docker-compose-clean.yml down" -ForegroundColor Gray
Write-Host ""

# Pergunta se quer ver os logs
$response = Read-Host "Deseja ver os logs em tempo real? (s/N)"
if ($response -eq "s" -or $response -eq "S") {
    Write-Host "Iniciando logs... (Ctrl+C para sair)" -ForegroundColor Yellow
    docker-compose -f docker-compose-clean.yml logs -f
}
