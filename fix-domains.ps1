# VIMS Domain Connection Troubleshoot
# Run this script to fix domain connection issues

Write-Host "🔍 VIMS Domain Connection Diagnostic" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Step 1: Check if Docker is running
Write-Host "`n1️⃣ Checking Docker status..." -ForegroundColor Yellow
try {
    $dockerStatus = docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>$null
    if ($dockerStatus) {
        Write-Host "✅ Docker is running" -ForegroundColor Green
        Write-Host $dockerStatus
    } else {
        Write-Host "❌ Docker is not running or no containers found" -ForegroundColor Red
        Write-Host "🔨 Starting VIMS services..." -ForegroundColor Yellow
        docker-compose up -d
    }
} catch {
    Write-Host "❌ Docker not found! Please install Docker Desktop" -ForegroundColor Red
    exit 1
}

# Step 2: Check hosts file
Write-Host "`n2️⃣ Checking Windows hosts file..." -ForegroundColor Yellow
$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
$hostsContent = Get-Content $hostsPath -ErrorAction SilentlyContinue

$requiredEntries = @(
    "127.0.0.1 vims.hexalyte.com",
    "127.0.0.1 api.vims.hexalyte.com", 
    "127.0.0.1 ws.vims.hexalyte.com",
    "127.0.0.1 db.vims.hexalyte.com"
)

$missingEntries = @()
foreach ($entry in $requiredEntries) {
    if ($hostsContent -notcontains $entry) {
        $missingEntries += $entry
    }
}

if ($missingEntries.Count -eq 0) {
    Write-Host "✅ All domain entries exist in hosts file" -ForegroundColor Green
} else {
    Write-Host "❌ Missing domain entries in hosts file:" -ForegroundColor Red
    foreach ($missing in $missingEntries) {
        Write-Host "   $missing" -ForegroundColor Yellow
    }
    
    Write-Host "`n🔧 To fix this, run PowerShell as Administrator and run:" -ForegroundColor Cyan
    Write-Host "Add-Content -Path '$hostsPath' -Value @(" -ForegroundColor Gray
    foreach ($missing in $missingEntries) {
        Write-Host "    '$missing'," -ForegroundColor Gray
    }
    Write-Host ")" -ForegroundColor Gray
}

# Step 3: Test domain connectivity
Write-Host "`n3️⃣ Testing domain connectivity..." -ForegroundColor Yellow

$domains = @{
    "Main App" = "http://vims.hexalyte.com"
    "API Backend" = "http://api.vims.hexalyte.com" 
    "Database Admin" = "http://db.vims.hexalyte.com"
}

foreach ($domain in $domains.GetEnumerator()) {
    try {
        $response = Invoke-WebRequest -Uri $domain.Value -TimeoutSec 5 -UseBasicParsing 2>$null
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $($domain.Key): $($domain.Value)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $($domain.Key): $($domain.Value) - Status: $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ $($domain.Key): $($domain.Value) - Not responding" -ForegroundColor Red
    }
}

# Step 4: Check specific services
Write-Host "`n4️⃣ Checking individual services..." -ForegroundColor Yellow

$services = @{
    "nginx-proxy" = "80"
    "frontend-app" = "3000"
    "backend-app" = "4444"
    "mysql-container" = "3306"
    "phpmyadmin-container" = "80"
}

foreach ($service in $services.GetEnumerator()) {
    try {
        $container = docker ps --filter "name=$($service.Key)" --format "{{.Status}}" 2>$null
        if ($container -and $container.StartsWith("Up")) {
            Write-Host "✅ $($service.Key): Running" -ForegroundColor Green
        } else {
            Write-Host "❌ $($service.Key): Not running" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ $($service.Key): Error checking status" -ForegroundColor Red
    }
}

# Step 5: Quick fixes
Write-Host "`n5️⃣ Quick fixes:" -ForegroundColor Yellow

# Check if nginx.conf exists
if (Test-Path "nginx.conf") {
    Write-Host "✅ nginx.conf file exists" -ForegroundColor Green
} else {
    Write-Host "❌ nginx.conf file missing!" -ForegroundColor Red
    Write-Host "🔨 Creating nginx.conf..." -ForegroundColor Yellow
    # Here we could recreate the nginx.conf if needed
}

# Check if .env exists
if (Test-Path ".env") {
    Write-Host "✅ .env file exists" -ForegroundColor Green
} else {
    Write-Host "❌ .env file missing!" -ForegroundColor Red
    if (Test-Path ".env.example") {
        Write-Host "🔨 Creating .env from .env.example..." -ForegroundColor Yellow
        Copy-Item ".env.example" ".env"
    }
}

# Step 6: Restart services if needed
Write-Host "`n6️⃣ Service restart options:" -ForegroundColor Yellow
Write-Host "To restart all services:" -ForegroundColor Cyan
Write-Host "   docker-compose down && docker-compose up -d" -ForegroundColor Gray

Write-Host "To restart only nginx:" -ForegroundColor Cyan 
Write-Host "   docker-compose restart nginx" -ForegroundColor Gray

Write-Host "To view logs:" -ForegroundColor Cyan
Write-Host "   docker-compose logs -f nginx" -ForegroundColor Gray

# Step 7: Manual domain test
Write-Host "`n7️⃣ Manual domain verification:" -ForegroundColor Yellow
Write-Host "1. Check hosts file: C:\Windows\System32\drivers\etc\hosts" -ForegroundColor Cyan
Write-Host "2. Test direct access:" -ForegroundColor Cyan
Write-Host "   - Frontend: http://localhost:3002" -ForegroundColor Gray
Write-Host "   - Backend: http://localhost:4444" -ForegroundColor Gray  
Write-Host "   - PhpMyAdmin: http://localhost:8080" -ForegroundColor Gray
Write-Host "3. Test domain access:" -ForegroundColor Cyan
Write-Host "   - Main: http://vims.hexalyte.com" -ForegroundColor Gray
Write-Host "   - API: http://api.vims.hexalyte.com" -ForegroundColor Gray
Write-Host "   - DB: http://db.vims.hexalyte.com" -ForegroundColor Gray

Write-Host "`n🎯 Next steps:" -ForegroundColor Green
$choice = Read-Host "`nChoose an option:`n[1] Fix hosts file (requires admin)`n[2] Restart services`n[3] View service logs`n[4] Open browser test`n[5] Exit`n"

switch ($choice) {
    "1" { 
        Write-Host "Run PowerShell as Administrator, then add these lines to hosts file:" -ForegroundColor Yellow
        foreach ($entry in $requiredEntries) {
            Write-Host $entry -ForegroundColor Gray
        }
    }
    "2" { 
        Write-Host "Restarting VIMS services..." -ForegroundColor Yellow
        docker-compose down
        docker-compose up -d --build
    }
    "3" { 
        Write-Host "Showing nginx logs..." -ForegroundColor Yellow
        docker-compose logs nginx
    }
    "4" { 
        Write-Host "Opening browser tests..." -ForegroundColor Yellow
        Start-Process "http://vims.hexalyte.com"
        Start-Process "http://api.vims.hexalyte.com"
    }
    "5" { 
        Write-Host "Done!" -ForegroundColor Green 
    }
}