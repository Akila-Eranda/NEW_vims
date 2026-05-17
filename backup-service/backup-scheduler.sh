#!/bin/bash
# VIMS Backup Scheduler Script

echo "🗄️ VIMS Backup Scheduler Starting..."

# Create crontab for automatic backups
BACKUP_SCHEDULE="${BACKUP_SCHEDULE:-0 2 * * *}"  # Default: 2 AM daily

# Add cron job for backup
echo "$BACKUP_SCHEDULE cd /app && python backup-mailer.py" > /tmp/backup-cron
crontab /tmp/backup-cron

echo "📋 Backup scheduled: $BACKUP_SCHEDULE"

# Start cron daemon
crond -f -l 2 &

# Keep the script running
tail -f /var/log/cron.log