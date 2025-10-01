# 🚀 Script de Deploy para GitHub
# Portal de Horários EPALC v1.2.0

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Portal de Horários EPALC - Deploy" -ForegroundColor Cyan
Write-Host "  Versão 1.2.0" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está no diretório correto
$currentDir = Get-Location
Write-Host "📁 Diretório atual: $currentDir" -ForegroundColor Yellow
Write-Host ""

# Verificar status do Git
Write-Host "🔍 Verificando status do Git..." -ForegroundColor Green
git status
Write-Host ""

# Perguntar se deseja continuar
$continue = Read-Host "Deseja continuar com o commit? (S/N)"
if ($continue -ne "S" -and $continue -ne "s") {
    Write-Host "❌ Deploy cancelado." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "📦 Adicionando arquivos..." -ForegroundColor Green
git add .

Write-Host ""
$commitMessage = Read-Host "💬 Digite a mensagem do commit (ou pressione Enter para usar padrão)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "v1.2.0 - Sistema de Cardápio Semanal + Identidade Visual"
}

Write-Host ""
Write-Host "💾 Fazendo commit: $commitMessage" -ForegroundColor Green
git commit -m "$commitMessage"

Write-Host ""
Write-Host "🚀 Enviando para GitHub..." -ForegroundColor Green
git push origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Deploy concluído com sucesso!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Acesse https://vercel.com/" -ForegroundColor White
Write-Host "2. Importe o repositório" -ForegroundColor White
Write-Host "3. Configure as variáveis de ambiente" -ForegroundColor White
Write-Host "4. Faça o deploy!" -ForegroundColor White
Write-Host ""
Write-Host "📖 Consulte DEPLOY_VERCEL.md para instruções detalhadas" -ForegroundColor Cyan
Write-Host ""

# Perguntar se deseja abrir o Vercel
$openVercel = Read-Host "Deseja abrir o Vercel no navegador? (S/N)"
if ($openVercel -eq "S" -or $openVercel -eq "s") {
    Start-Process "https://vercel.com/new"
}

Write-Host ""
Write-Host "🎉 Obrigado por usar o Portal de Horários EPALC!" -ForegroundColor Green
Write-Host ""