#!/bin/bash
# ============================================================
# VIMS Deploy Script - Run this on the server to update
# Usage: bash deploy.sh
# ============================================================

set -e

APP_DIR="/opt/vims"
REPO_URL="https://github.com/Akila-Eranda/NEW_vims.git"
BRANCH="main"

echo "======================================"
echo "  VIMS Deployment Script"
echo "======================================"

# Go to app directory
cd "$APP_DIR"

echo "[1/4] Pulling latest code from GitHub..."
git fetch origin
git reset --hard origin/$BRANCH
git pull origin $BRANCH
echo "      Done."

echo "[2/4] Stopping existing containers..."
docker compose down
echo "      Done."

echo "[3/4] Rebuilding and starting containers..."
docker compose up --build -d
echo "      Done."

echo "[4/4] Checking container status..."
sleep 5
docker compose ps

echo ""
echo "======================================"
echo "  Deployment Complete!"
echo "======================================"
docker compose logs --tail=20
