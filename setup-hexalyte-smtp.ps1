# VIMS Hexalyte SMTP Setup Script
# Configure and test backup email with Hexalyte mail server

Write-Host "📧 VIMS Hexalyte SMTP Configuration" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

Write-Host "`n✅ Hexalyte SMTP Credentials Configured:" -ForegroundColor Green
Write-Host "   Host: mail.hexalyte.com" -ForegroundColor Gray
Write-Host "   Port: 587" -ForegroundColor Gray  
Write-Host "   User: vims@hexalyte.com" -ForegroundColor Gray
Write-Host "   Password: ********** (configured)" -ForegroundColor Gray
Write-Host "   TLS: Enabled" -ForegroundColor Gray

# Step 1: Test Python SMTP connection
Write-Host "`n🧪 Testing SMTP Connection..." -ForegroundColor Yellow

try {
    python test-hexalyte-smtp.py
} catch {
    Write-Host "⚠️ Python test failed. Continuing with Docker setup..." -ForegroundColor Yellow
}

# Step 2: Build and start backup service
Write-Host "`n🚀 Starting VIMS Backup Service with Hexalyte SMTP..." -ForegroundColor Yellow

try {
    # Stop existing services
    Write-Host "🛑 Stopping existing services..." -ForegroundColor Gray
    docker-compose down 2>$null
    
    # Build and start with backup service
    Write-Host "🔨 Building services..." -ForegroundColor Gray
    docker-compose up --build -d
    
    # Wait for services to start
    Write-Host "⏳ Waiting for services to initialize..." -ForegroundColor Gray
    Start-Sleep -Seconds 10
    
    # Check backup service status
    Write-Host "`n📊 Service Status:" -ForegroundColor Cyan
    docker-compose ps
    
    Write-Host "`n📋 Backup Service Logs:" -ForegroundColor Cyan
    docker-compose logs backup --tail=20
    
} catch {
    Write-Host "❌ Error starting services: $_" -ForegroundColor Red
}

# Step 3: Configuration summary
Write-Host "`n📧 Email Configuration Active:" -ForegroundColor Green
Write-Host "   ✉️  From: vims@hexalyte.com" -ForegroundColor Gray
Write-Host "   📤 To: admin@hexalyte.com, manager@hexalyte.com" -ForegroundColor Gray
Write-Host "   📋 CC: it-support@hexalyte.com" -ForegroundColor Gray

Write-Host "`n⏰ Backup Schedule:" -ForegroundColor Green
Write-Host "   📅 Daily at 2:00 AM" -ForegroundColor Gray
Write-Host "   💚 Health check: Weekly Monday 9:00 AM" -ForegroundColor Gray
Write-Host "   🧹 Cleanup: Weekly Sunday 3:00 AM" -ForegroundColor Gray

Write-Host "`n🔧 Useful Commands:" -ForegroundColor Cyan
Write-Host "   docker-compose logs backup -f    # Live logs" -ForegroundColor Gray
Write-Host "   docker-compose restart backup    # Restart service" -ForegroundColor Gray
Write-Host "   ls ./backup/                    # Check backup files" -ForegroundColor Gray

Write-Host "`n🎯 Test Commands:" -ForegroundColor Cyan
Write-Host "   python test-hexalyte-smtp.py    # Test SMTP" -ForegroundColor Gray
Write-Host "   docker-compose exec backup python test-backup.py  # Test backup" -ForegroundColor Gray

# Step 4: Run immediate test backup
$testBackup = Read-Host "`n🧪 Run test backup now? (y/n)"
if ($testBackup -eq 'y' -or $testBackup -eq 'Y') {
    Write-Host "🗄️ Running test backup with Hexalyte SMTP..." -ForegroundColor Yellow
    try {
        docker-compose exec backup python test-backup.py
        Write-Host "✅ Test backup completed!" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Test backup failed. Check logs: docker-compose logs backup" -ForegroundColor Yellow
    }
}

Write-Host "`n🎉 Hexalyte SMTP Backup Service Ready!" -ForegroundColor Green
Write-Host "📧 Backup emails will be sent from vims@hexalyte.com" -ForegroundColor White
Write-Host "⏰ Next backup: Daily at 2:00 AM" -ForegroundColor White

$openLogs = Read-Host "`n📊 View backup service logs? (y/n)"
if ($openLogs -eq 'y' -or $openLogs -eq 'Y') {
    docker-compose logs backup -f
}