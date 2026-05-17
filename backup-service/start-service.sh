#!/bin/bash
# VIMS Backup Service Startup Script

echo "🚀 Starting VIMS Backup Service with Email..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
while ! mysqladmin ping -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" --silent; do
    echo "Database not ready, waiting 5 seconds..."
    sleep 5
done

echo "✅ Database connection established"

# Test SMTP connection
echo "📧 Testing SMTP connection..."
python3 -c "
import smtplib
import os
try:
    server = smtplib.SMTP('${SMTP_HOST}', ${SMTP_PORT})
    if '${SMTP_USE_TLS}' == 'true':
        server.starttls()
    server.login('${SMTP_USER}', '${SMTP_PASSWORD}')
    server.quit()
    print('✅ SMTP connection successful')
except Exception as e:
    print(f'⚠️ SMTP connection warning: {e}')
"

# Create directories
mkdir -p /app/backup /app/logs

# Start the main backup service
echo "🎯 Starting backup service..."
python3 backup-mailer.py