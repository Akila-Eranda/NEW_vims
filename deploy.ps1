# ============================================================
# VIMS Deploy from Windows - SSH into server and deploy
# Usage: .\deploy.ps1
# ============================================================

$SERVER_IP   = "49.12.207.238"
$SERVER_USER = "root"          # Change if different (e.g. ubuntu)
$SSH_KEY     = ""              # Path to SSH key, e.g. "C:\Users\Akila\.ssh\id_rsa" (leave empty for password)

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  VIMS Remote Deployment" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Target: $SERVER_USER@$SERVER_IP" -ForegroundColor Yellow

# Build SSH command
if ($SSH_KEY -ne "") {
    $sshArgs = "-i `"$SSH_KEY`" $SERVER_USER@$SERVER_IP"
} else {
    $sshArgs = "$SERVER_USER@$SERVER_IP"
}

# Run deploy script on server
Write-Host ""
Write-Host "[*] Connecting to server and deploying..." -ForegroundColor Yellow

$deployCommand = "bash /opt/vims/deploy.sh"

if ($SSH_KEY -ne "") {
    ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" $deployCommand
} else {
    ssh "$SERVER_USER@$SERVER_IP" $deployCommand
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "======================================" -ForegroundColor Green
    Write-Host "  Deployment Successful!" -ForegroundColor Green
    Write-Host "======================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "  Deployment failed. Check the output above." -ForegroundColor Red
}
