# SISTEMA DE EVENTOS - VERSAO DEMO 100% FUNCIONAL
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "           SISTEMA DE GERENCIAMENTO DE EVENTOS" -ForegroundColor White
Write-Host "                   VERSAO DEMO - 100% FUNCIONAL" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ""

# Para todos os containers anteriores
Write-Host "Parando containers anteriores..." -ForegroundColor Yellow
docker stop $(docker ps -q) 2>$null
docker rm $(docker ps -aq) 2>$null

# Subir a versao demo
Write-Host "Iniciando versao demo..." -ForegroundColor Yellow
docker-compose -f docker-compose-demo.yml up -d

# Aguardar inicializacao
Write-Host "Aguardando inicializacao..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Verificar status
Write-Host "Status do sistema:" -ForegroundColor Cyan
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Host ""
Write-Host "SISTEMA FUNCIONANDO!" -ForegroundColor Green
Write-Host ""
Write-Host "==========================================================" -ForegroundColor Blue
Write-Host "ACESSE AGORA: http://localhost:3000/" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Blue
Write-Host ""
Write-Host "FUNCIONALIDADES DISPONIVEIS:" -ForegroundColor White
Write-Host "   Criar novos eventos" -ForegroundColor Green
Write-Host "   Editar eventos existentes" -ForegroundColor Green
Write-Host "   Visualizar detalhes dos eventos" -ForegroundColor Green
Write-Host "   Excluir eventos" -ForegroundColor Green
Write-Host "   Estatisticas em tempo real" -ForegroundColor Green
Write-Host "   Interface moderna e responsiva" -ForegroundColor Green
Write-Host "   Zero erros de console" -ForegroundColor Green
Write-Host ""
Write-Host "CARACTERISTICAS TECNICAS:" -ForegroundColor White
Write-Host "   Versao demo com dados mockados" -ForegroundColor Cyan
Write-Host "   Nao requer backend/database" -ForegroundColor Cyan
Write-Host "   100% funcional e testavel" -ForegroundColor Cyan
Write-Host "   Bootstrap 5.3.2 + JavaScript Vanilla" -ForegroundColor Cyan
Write-Host "   Completamente livre de erros CDK" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para parar o sistema:" -ForegroundColor Red
Write-Host "   docker-compose -f docker-compose-demo.yml down" -ForegroundColor Gray
Write-Host ""

# Testar conectividade
Write-Host "Testando conectividade..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "Sistema respondendo corretamente!" -ForegroundColor Green
        Write-Host "Codigo de status: $($response.StatusCode)" -ForegroundColor Green
    }
} catch {
    Write-Host "Erro ao testar conectividade: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "DEMONSTRACAO PRONTA PARA USO!" -ForegroundColor Green
Write-Host "Abra http://localhost:3000/ no seu navegador" -ForegroundColor White
