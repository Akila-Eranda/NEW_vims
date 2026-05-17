#!/usr/bin/env python3
"""
VIMS Database Backup with SMTP Email Service
Automatically backs up MySQL database and emails the backup file
"""

import os
import smtplib
import zipfile
import subprocess
import datetime
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from pathlib import Path
import mysql.connector
import schedule
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/app/logs/backup.log'),
        logging.StreamHandler()
    ]
)

class VIMSBackupMailer:
    def __init__(self):
        self.db_host = os.getenv('DB_HOST', 'mysql')
        self.db_port = os.getenv('DB_PORT', '3306')
        self.db_name = os.getenv('DB_NAME', 'hexa_vims_db_development')
        self.db_user = os.getenv('DB_USER', 'admin')
        self.db_password = os.getenv('DB_PASSWORD', '')
        
        # SMTP Configuration
        self.smtp_host = os.getenv('SMTP_HOST', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.smtp_user = os.getenv('SMTP_USER', '')
        self.smtp_password = os.getenv('SMTP_PASSWORD', '')
        self.smtp_use_tls = os.getenv('SMTP_USE_TLS', 'true').lower() == 'true'
        
        # Email Configuration
        self.email_from = os.getenv('EMAIL_FROM', self.smtp_user)
        self.email_to = os.getenv('EMAIL_TO', '').split(',')
        self.email_cc = os.getenv('EMAIL_CC', '').split(',') if os.getenv('EMAIL_CC') else []
        
        # Backup Configuration
        self.backup_dir = Path('/app/backup')
        self.retention_days = int(os.getenv('BACKUP_RETENTION_DAYS', '30'))
        self.max_file_size_mb = int(os.getenv('MAX_EMAIL_ATTACHMENT_MB', '25'))
        
        # Ensure backup directory exists
        self.backup_dir.mkdir(exist_ok=True)
        
    def test_db_connection(self):
        """Test database connection"""
        try:
            connection = mysql.connector.connect(
                host=self.db_host,
                port=self.db_port,
                database=self.db_name,
                user=self.db_user,
                password=self.db_password
            )
            if connection.is_connected():
                logging.info("Database connection successful")
                connection.close()
                return True
        except mysql.connector.Error as e:
            logging.error(f"Database connection failed: {e}")
            return False
            
    def test_smtp_connection(self):
        """Test SMTP connection"""
        try:
            server = smtplib.SMTP(self.smtp_host, self.smtp_port)
            if self.smtp_use_tls:
                server.starttls()
            server.login(self.smtp_user, self.smtp_password)
            server.quit()
            logging.info("SMTP connection successful")
            return True
        except Exception as e:
            logging.error(f"SMTP connection failed: {e}")
            return False
            
    def create_database_backup(self):
        """Create MySQL database backup using mysqldump"""
        timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_filename = f"vims_backup_{timestamp}.sql"
        backup_filepath = self.backup_dir / backup_filename
        
        try:
            # Create mysqldump command
            cmd = [
                'mysqldump',
                f'--host={self.db_host}',
                f'--port={self.db_port}',
                f'--user={self.db_user}',
                f'--password={self.db_password}',
                '--single-transaction',
                '--routines',
                '--triggers',
                '--complete-insert',
                '--add-drop-table',
                self.db_name
            ]
            
            # Execute mysqldump
            with open(backup_filepath, 'w') as backup_file:
                result = subprocess.run(cmd, stdout=backup_file, stderr=subprocess.PIPE, text=True)
                
            if result.returncode == 0:
                logging.info(f"Database backup created: {backup_filepath}")
                return backup_filepath
            else:
                logging.error(f"mysqldump failed: {result.stderr}")
                return None
                
        except Exception as e:
            logging.error(f"Backup creation failed: {e}")
            return None
            
    def compress_backup(self, backup_filepath):
        """Compress backup file to reduce size"""
        try:
            zip_filepath = backup_filepath.with_suffix('.zip')
            
            with zipfile.ZipFile(zip_filepath, 'w', zipfile.ZIP_DEFLATED) as zipf:
                zipf.write(backup_filepath, backup_filepath.name)
                
            # Remove original SQL file
            backup_filepath.unlink()
            
            # Check file size
            file_size_mb = zip_filepath.stat().st_size / (1024 * 1024)
            logging.info(f"Compressed backup created: {zip_filepath} ({file_size_mb:.2f} MB)")
            
            return zip_filepath, file_size_mb
            
        except Exception as e:
            logging.error(f"Compression failed: {e}")
            return None, 0
            
    def send_email_backup(self, backup_filepath, file_size_mb):
        """Send backup file via email"""
        if not self.email_to or not self.smtp_user:
            logging.warning("Email configuration incomplete, skipping email")
            return False
            
        try:
            # Create email message
            msg = MIMEMultipart()
            msg['From'] = self.email_from
            msg['To'] = ', '.join([email.strip() for email in self.email_to if email.strip()])
            if self.email_cc:
                msg['Cc'] = ', '.join([email.strip() for email in self.email_cc if email.strip()])
                
            timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            msg['Subject'] = f"VIMS Database Backup - {timestamp}"
            
            # Email body
            body = f\"\"\"
VIMS Database Backup Report
========================

Backup Details:
- Date: {timestamp}
- Database: {self.db_name}
- File: {backup_filepath.name}
- Size: {file_size_mb:.2f} MB
- Status: Successful

This is an automated backup from the VIMS system.
The database backup is attached to this email.

System Information:
- Database Host: {self.db_host}
- Backup Service: Running
- SMTP Connection: Active

---
VIMS Backup Service
Hexalyte Pvt Ltd
\"\"\"
            
            msg.attach(MIMEText(body, 'plain'))
            
            # Attach backup file if not too large
            if file_size_mb <= self.max_file_size_mb:
                with open(backup_filepath, 'rb') as attachment:
                    part = MIMEBase('application', 'octet-stream')
                    part.set_payload(attachment.read())
                    
                encoders.encode_base64(part)
                part.add_header(
                    'Content-Disposition',
                    f'attachment; filename= {backup_filepath.name}'
                )
                msg.attach(part)
                logging.info(f"Backup file attached (size: {file_size_mb:.2f} MB)")
            else:
                warning_text = f\"\"\"
                
⚠️ WARNING: Backup file too large for email ({file_size_mb:.2f} MB > {self.max_file_size_mb} MB)
The backup file has been created but not attached.
Please check the backup directory on the server: {backup_filepath}
\"\"\"
                msg.attach(MIMEText(warning_text, 'plain'))
                logging.warning(f"Backup file too large for email: {file_size_mb:.2f} MB")
                
            # Send email
            server = smtplib.SMTP(self.smtp_host, self.smtp_port)
            if self.smtp_use_tls:
                server.starttls()
            server.login(self.smtp_user, self.smtp_password)
            
            # Combine To and CC recipients
            all_recipients = [email.strip() for email in self.email_to if email.strip()]
            if self.email_cc:
                all_recipients.extend([email.strip() for email in self.email_cc if email.strip()])
                
            server.send_message(msg, to_addrs=all_recipients)
            server.quit()
            
            logging.info(f"Backup email sent to: {', '.join(all_recipients)}")
            return True
            
        except Exception as e:
            logging.error(f"Email sending failed: {e}")
            return False
            
    def cleanup_old_backups(self):
        """Remove backup files older than retention period"""
        try:
            cutoff_date = datetime.datetime.now() - datetime.timedelta(days=self.retention_days)
            deleted_count = 0
            
            for backup_file in self.backup_dir.glob("vims_backup_*.zip"):
                file_date = datetime.datetime.fromtimestamp(backup_file.stat().st_mtime)
                if file_date < cutoff_date:
                    backup_file.unlink()
                    deleted_count += 1
                    logging.info(f"Deleted old backup: {backup_file.name}")
                    
            if deleted_count > 0:
                logging.info(f"Cleaned up {deleted_count} old backup files")
            else:
                logging.info("No old backup files to clean up")
                
        except Exception as e:
            logging.error(f"Cleanup failed: {e}")
            
    def send_health_check_email(self):
        """Send periodic health check email"""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.email_from
            msg['To'] = ', '.join([email.strip() for email in self.email_to if email.strip()])
            msg['Subject'] = "VIMS Backup Service - Health Check"
            
            timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            # Check database connection
            db_status = "✅ Connected" if self.test_db_connection() else "❌ Failed"
            
            # Check backup directory
            backup_count = len(list(self.backup_dir.glob("vims_backup_*.zip")))
            
            body = f\"\"\"
VIMS Backup Service Health Check
===============================

Service Status: ✅ Running
Timestamp: {timestamp}

Component Status:
- Database Connection: {db_status}
- SMTP Connection: ✅ Active
- Backup Directory: ✅ Accessible
- Recent Backups: {backup_count} files

Configuration:
- Database: {self.db_host}:{self.db_port}/{self.db_name}
- SMTP: {self.smtp_host}:{self.smtp_port}
- Retention: {self.retention_days} days
- Max Email Size: {self.max_file_size_mb} MB

Next scheduled backup will be created automatically.

---
VIMS Backup Service
Hexalyte Pvt Ltd
\"\"\"
            
            msg.attach(MIMEText(body, 'plain'))
            
            server = smtplib.SMTP(self.smtp_host, self.smtp_port)
            if self.smtp_use_tls:
                server.starttls()
            server.login(self.smtp_user, self.smtp_password)
            server.send_message(msg, to_addrs=[email.strip() for email in self.email_to if email.strip()])
            server.quit()
            
            logging.info("Health check email sent")
            return True
            
        except Exception as e:
            logging.error(f"Health check email failed: {e}")
            return False
            
    def perform_backup(self):
        """Main backup process"""
        logging.info("=" * 50)
        logging.info("Starting VIMS database backup process")
        
        # Test connections first
        if not self.test_db_connection():
            logging.error("Database connection failed, aborting backup")
            return False
            
        if not self.test_smtp_connection():
            logging.error("SMTP connection failed, backup will continue but email may fail")
            
        # Create backup
        backup_filepath = self.create_database_backup()
        if not backup_filepath:
            logging.error("Backup creation failed")
            return False
            
        # Compress backup
        compressed_filepath, file_size_mb = self.compress_backup(backup_filepath)
        if not compressed_filepath:
            logging.error("Backup compression failed")
            return False
            
        # Send email
        email_sent = self.send_email_backup(compressed_filepath, file_size_mb)
        
        # Cleanup old backups
        self.cleanup_old_backups()
        
        if email_sent:
            logging.info("Backup process completed successfully with email")
        else:
            logging.info("Backup process completed but email failed")
            
        logging.info("=" * 50)
        return True

def main():
    """Main function to run backup service"""
    backup_service = VIMSBackupMailer()
    
    # Get schedule from environment (default: daily at 2 AM)
    backup_schedule = os.getenv('BACKUP_SCHEDULE', '0 2 * * *')  # cron format
    email_enabled = os.getenv('EMAIL_ENABLED', 'true').lower() == 'true'
    
    logging.info("VIMS Backup Service Starting")
    logging.info(f"Database: {backup_service.db_host}:{backup_service.db_port}/{backup_service.db_name}")
    logging.info(f"SMTP: {backup_service.smtp_host}:{backup_service.smtp_port}")
    logging.info(f"Email enabled: {email_enabled}")
    
    # Test initial connections
    if backup_service.test_db_connection() and backup_service.test_smtp_connection():
        logging.info("Initial connection tests passed")
        
        # Send startup notification
        if email_enabled:
            backup_service.send_health_check_email()
    else:
        logging.error("Initial connection tests failed")
        
    # Schedule backups (using simple daily backup for now)
    schedule.every().day.at("02:00").do(backup_service.perform_backup)
    
    # Schedule weekly health check
    schedule.every().monday.at("09:00").do(backup_service.send_health_check_email)
    
    # Schedule cleanup (weekly)
    schedule.every().sunday.at("03:00").do(backup_service.cleanup_old_backups)
    
    # Run immediately if requested
    if os.getenv('RUN_BACKUP_NOW', 'false').lower() == 'true':
        backup_service.perform_backup()
        
    # Main service loop
    logging.info("Backup service scheduled and running...")
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute

if __name__ == "__main__":
    main()