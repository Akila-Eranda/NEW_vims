# VIMS Automated Backup Email Setup Script
# Run this script to configure backup email service

Write-Host "📧 VIMS Backup Email Service Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Step 1: Check if .env exists
Write-Host "`n1️⃣ Checking environment configuration..." -ForegroundColor Yellow

if (Test-Path ".env") {
    Write-Host "✅ .env file found" -ForegroundColor Green
} else {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ Created .env from .env.example" -ForegroundColor Green
    } else {
        Write-Host "❌ .env.example not found!" -ForegroundColor Red
        exit 1
    }
}

# Step 2: Gmail Configuration
Write-Host "`n2️⃣ Gmail SMTP Configuration" -ForegroundColor Yellow
Write-Host "For Gmail, you need an 'App Password' (not your regular password)" -ForegroundColor Cyan

$useGmail = Read-Host "`nAre you using Gmail for backups? (y/n)"

if ($useGmail -eq 'y' -or $useGmail -eq 'Y') {
    Write-Host "`n📋 Gmail Setup Instructions:" -ForegroundColor Green
    Write-Host "1. Go to your Google Account Settings" -ForegroundColor Gray
    Write-Host "2. Security → 2-Step Verification" -ForegroundColor Gray
    Write-Host "3. Generate App Password for 'Mail'" -ForegroundColor Gray
    Write-Host "4. Use this 16-character password below" -ForegroundColor Gray
    Write-Host ""
    
    $gmailUser = Read-Host "Enter your Gmail address"
    $gmailAppPassword = Read-Host "Enter your Gmail App Password (16 characters)" -AsSecureString
    $gmailAppPasswordText = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($gmailAppPassword))
    
    # Update .env file with Gmail settings
    $envContent = Get-Content ".env"
    $envContent = $envContent -replace "SMTP_USER=.*", "SMTP_USER=$gmailUser"
    $envContent = $envContent -replace "SMTP_PASSWORD=.*", "SMTP_PASSWORD=$gmailAppPasswordText"
    $envContent = $envContent -replace "EMAIL_FROM=.*", "EMAIL_FROM=$gmailUser"
    
    Set-Content -Path ".env" -Value $envContent
    Write-Host "✅ Gmail SMTP configuration updated" -ForegroundColor Green
}

# Step 3: Email Recipients
Write-Host "`n3️⃣ Email Recipients Configuration" -ForegroundColor Yellow

$emailRecipients = Read-Host "Enter backup email recipients (comma-separated)"
if ($emailRecipients) {
    $envContent = Get-Content ".env"
    $envContent = $envContent -replace "EMAIL_TO=.*", "EMAIL_TO=$emailRecipients"
    Set-Content -Path ".env" -Value $envContent
    Write-Host "✅ Email recipients configured: $emailRecipients" -ForegroundColor Green
}

# Step 4: Backup Schedule
Write-Host "`n4️⃣ Backup Schedule Configuration" -ForegroundColor Yellow
Write-Host "Choose backup frequency:" -ForegroundColor Cyan
Write-Host "[1] Daily at 2 AM (recommended)" -ForegroundColor Gray
Write-Host "[2] Every 6 hours" -ForegroundColor Gray
Write-Host "[3] Weekly (Sunday 2 AM)" -ForegroundColor Gray
Write-Host "[4] Custom schedule" -ForegroundColor Gray

$scheduleChoice = Read-Host "Enter choice (1-4)"

$cronSchedule = switch ($scheduleChoice) {
    "1" { "0 2 * * *" }
    "2" { "0 */6 * * *" }
    "3" { "0 2 * * 0" }
    "4" { 
        $customSchedule = Read-Host "Enter cron expression (e.g., '0 2 * * *')"
        $customSchedule
    }
    default { "0 2 * * *" }
}

$envContent = Get-Content ".env"
$envContent = $envContent -replace "BACKUP_SCHEDULE=.*", "BACKUP_SCHEDULE=$cronSchedule"
Set-Content -Path ".env" -Value $envContent
Write-Host "✅ Backup schedule set: $cronSchedule" -ForegroundColor Green

# Step 5: Test Configuration
Write-Host "`n5️⃣ Testing Configuration" -ForegroundColor Yellow

$testNow = Read-Host "Run test backup now? (y/n)"
if ($testNow -eq 'y' -or $testNow -eq 'Y') {
    $envContent = Get-Content ".env"
    $envContent = $envContent -replace "RUN_BACKUP_NOW=.*", "RUN_BACKUP_NOW=true"
    Set-Content -Path ".env" -Value $envContent
    Write-Host "✅ Test backup will run when service starts" -ForegroundColor Green
}

# Step 6: Start Services
Write-Host "`n6️⃣ Starting Backup Service" -ForegroundColor Yellow

try {
    Write-Host "🚀 Building and starting VIMS with backup service..." -ForegroundColor Cyan
    
    # Start services
    docker-compose up -d --build
    
    # Wait a moment
    Start-Sleep -Seconds 5
    
    # Check backup service status
    Write-Host "`n📊 Service Status:" -ForegroundColor Cyan
    docker-compose ps backup
    
    Write-Host "`n📋 View backup service logs:" -ForegroundColor Cyan
    Write-Host "   docker-compose logs -f backup" -ForegroundColor Gray
    
    Write-Host "`n🗂️ Backup files location:" -ForegroundColor Cyan
    Write-Host "   ./backup/" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Error starting services: $_" -ForegroundColor Red
}

# Step 7: Final Instructions
Write-Host "`n🎉 Backup Email Service Setup Complete!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

Write-Host "`n📧 What happens now:" -ForegroundColor Cyan
Write-Host "• Automatic database backups at scheduled time" -ForegroundColor White
Write-Host "• Compressed backup files emailed to recipients" -ForegroundColor White
Write-Host "• Health check emails sent weekly" -ForegroundColor White
Write-Host "• Old backups cleaned up automatically" -ForegroundColor White

Write-Host "`n🔧 Monitoring commands:" -ForegroundColor Cyan
Write-Host "  docker-compose logs backup          # View service logs" -ForegroundColor Gray
Write-Host "  docker-compose restart backup       # Restart service" -ForegroundColor Gray
Write-Host "  ls ./backup/                       # Check backup files" -ForegroundColor Gray

Write-Host "`n📁 Important files:" -ForegroundColor Cyan
Write-Host "  📄 .env                           # Configuration" -ForegroundColor Gray
Write-Host "  📁 ./backup/                      # Local backup files" -ForegroundColor Gray
Write-Host "  📁 ./logs/                        # Service logs" -ForegroundColor Gray
Write-Host "  📖 BACKUP_EMAIL_SETUP.md          # Full documentation" -ForegroundColor Gray

Write-Host "`n⚠️ Remember:" -ForegroundColor Yellow
Write-Host "• Use Gmail App Password (not regular password)" -ForegroundColor White
Write-Host "• Check spam folder for first backup email" -ForegroundColor White
Write-Host "• Large backups (>25MB) won't be emailed" -ForegroundColor White

$viewLogs = Read-Host "`n📊 View backup service logs now? (y/n)"
if ($viewLogs -eq 'y' -or $viewLogs -eq 'Y') {
    docker-compose logs -f backup
}