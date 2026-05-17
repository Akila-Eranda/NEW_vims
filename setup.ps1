# VIMS Local Setup Script (No SSL)
# Run this script as Administrator in PowerShell

Write-Host "🚀 Setting up VIMS with Nginx (HTTP - No SSL)..." -ForegroundColor Green

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ Please run this script as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

# Step 1: Update hosts file for local testing
Write-Host "📝 Updating hosts file for local domain testing..." -ForegroundColor Yellow

$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
$domains = @(
    "127.0.0.1 vims.hexalyte.com",
    "127.0.0.1 api.vims.hexalyte.com", 
    "127.0.0.1 ws.vims.hexalyte.com",
    "127.0.0.1 db.vims.hexalyte.com"
)

# Read current hosts file
$hostsContent = Get-Content $hostsPath -ErrorAction SilentlyContinue

# Add VIMS domains if not present
$modified = $false
foreach ($domain in $domains) {
    if ($hostsContent -notcontains $domain) {
        Add-Content -Path $hostsPath -Value $domain
        Write-Host "  ✅ Added: $domain" -ForegroundColor Green
        $modified = $true
    } else {
        Write-Host "  ⚠️  Already exists: $domain" -ForegroundColor Yellow
    }
}

if (-not $modified) {
    Write-Host "  ℹ️  All domains already configured" -ForegroundColor Cyan
}

# Step 2: Create .env file if not exists
Write-Host "📋 Setting up environment configuration..." -ForegroundColor Yellow

if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "  ✅ Created .env from .env.example" -ForegroundColor Green
    } else {
        Write-Host "  ❌ .env.example not found!" -ForegroundColor Red
    }
} else {
    Write-Host "  ℹ️  .env file already exists" -ForegroundColor Cyan
}

# Step 3: Check Docker
Write-Host "🐳 Checking Docker..." -ForegroundColor Yellow

try {
    $dockerVersion = docker --version
    Write-Host "  ✅ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Docker not found or not running!" -ForegroundColor Red
    Write-Host "  Please install Docker Desktop and make sure it's running" -ForegroundColor Yellow
    exit 1
}

try {
    $composeVersion = docker-compose --version
    Write-Host "  ✅ Docker Compose found: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Docker Compose not found!" -ForegroundColor Red
    exit 1
}

# Step 4: Start services
Write-Host "🚀 Starting VIMS services..." -ForegroundColor Yellow

try {
    # Stop any existing containers
    Write-Host "  🛑 Stopping existing containers..." -ForegroundColor Cyan
    docker-compose down 2>$null

    # Build and start services
    Write-Host "  🔨 Building and starting services..." -ForegroundColor Cyan
    docker-compose up --build -d

    # Wait a moment for services to start
    Write-Host "  ⏳ Waiting for services to start..." -ForegroundColor Cyan
    Start-Sleep -Seconds 10

    # Check service status
    Write-Host "  📊 Checking service status..." -ForegroundColor Cyan
    docker-compose ps

    Write-Host "`n🎉 Setup completed successfully!" -ForegroundColor Green

} catch {
    Write-Host "  ❌ Error starting services: $_" -ForegroundColor Red
    exit 1
}

# Step 5: Display access information
Write-Host "`n📍 Access your VIMS application:" -ForegroundColor Cyan
Write-Host "  🌐 Main App:      http://vims.hexalyte.com" -ForegroundColor White
Write-Host "  📡 API Docs:      http://api.vims.hexalyte.com/docs" -ForegroundColor White  
Write-Host "  🗄️  Database:     http://db.vims.hexalyte.com" -ForegroundColor White
Write-Host "  🔌 WebSocket:     ws://ws.vims.hexalyte.com" -ForegroundColor White

Write-Host "`n🔧 Useful commands:" -ForegroundColor Cyan
Write-Host "  docker-compose logs -f        # View logs" -ForegroundColor Gray
Write-Host "  docker-compose restart nginx  # Restart nginx" -ForegroundColor Gray
Write-Host "  docker-compose down          # Stop all services" -ForegroundColor Gray

Write-Host "`n✨ Your VIMS system is ready!" -ForegroundColor Green
Write-Host "📱 Flutter app should connect to: http://api.vims.hexalyte.com" -ForegroundColor Yellow

# Optional: Open browser
$openBrowser = Read-Host "`n🌐 Open main app in browser? (y/n)"
if ($openBrowser -eq 'y' -or $openBrowser -eq 'Y') {
    Start-Process "http://vims.hexalyte.com"
}