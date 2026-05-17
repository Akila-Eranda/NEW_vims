#!/usr/bin/env python3
"""
Quick backup test script
Run this to test backup functionality manually
"""

import os
import sys
sys.path.append('/app')

from backup-mailer import VIMSBackupMailer
import logging

# Configure logging for console output
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def main():
    print("🧪 VIMS Backup Service Test")
    print("===========================")
    
    backup_service = VIMSBackupMailer()
    
    print("\n1️⃣ Testing Database Connection...")
    if backup_service.test_db_connection():
        print("✅ Database connection successful")
    else:
        print("❌ Database connection failed")
        return False
        
    print("\n2️⃣ Testing SMTP Connection...")
    if backup_service.test_smtp_connection():
        print("✅ SMTP connection successful")
    else:
        print("❌ SMTP connection failed")
        return False
        
    print("\n3️⃣ Running Test Backup...")
    if backup_service.perform_backup():
        print("✅ Backup completed successfully")
    else:
        print("❌ Backup failed")
        return False
        
    print("\n🎉 All tests passed! Backup service is working correctly.")
    return True

if __name__ == "__main__":
    if main():
        sys.exit(0)
    else:
        sys.exit(1)