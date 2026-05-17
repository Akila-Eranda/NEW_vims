#!/usr/bin/env python3
"""
Test Hexalyte SMTP Connection
Quick script to verify mail.hexalyte.com SMTP settings
"""

import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import datetime

# Hexalyte SMTP Configuration
SMTP_HOST = "mail.hexalyte.com"
SMTP_PORT = 587
SMTP_USER = "vims@hexalyte.com"
SMTP_PASSWORD = "31,-,klEyNe"

print("🔧 Testing Hexalyte SMTP Connection")
print("===================================")
print(f"Host: {SMTP_HOST}")
print(f"Port: {SMTP_PORT}")
print(f"User: {SMTP_USER}")

try:
    # Test connection
    print("\n1️⃣ Connecting to SMTP server...")
    server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
    
    print("2️⃣ Starting TLS encryption...")
    server.starttls()
    
    print("3️⃣ Authenticating...")
    server.login(SMTP_USER, SMTP_PASSWORD)
    
    print("✅ SMTP connection successful!")
    
    # Optional: Send test email
    send_test = input("\n📧 Send test email? (y/n): ")
    if send_test.lower() == 'y':
        test_email = input("Enter test recipient email: ")
        
        # Create test message
        msg = MIMEMultipart()
        msg['From'] = SMTP_USER
        msg['To'] = test_email
        msg['Subject'] = "VIMS SMTP Test - " + datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        body = f"""
VIMS SMTP Test Email
===================

This is a test email from the VIMS backup system.

SMTP Configuration:
- Host: {SMTP_HOST}
- Port: {SMTP_PORT}
- User: {SMTP_USER}
- TLS: Enabled
- Status: Working ✅

Timestamp: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

If you received this email, the SMTP configuration is working correctly.

---
VIMS Backup Service
Hexalyte Pvt Ltd
"""
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send test email
        server.send_message(msg)
        print(f"✅ Test email sent to {test_email}")
    
    server.quit()
    print("\n🎉 Hexalyte SMTP test completed successfully!")
    
except smtplib.SMTPAuthenticationError as e:
    print(f"❌ Authentication failed: {e}")
    print("Check username/password")
except smtplib.SMTPConnectError as e:
    print(f"❌ Connection failed: {e}")
    print("Check host/port settings")
except smtplib.SMTPRecipientsRefused as e:
    print(f"❌ Recipient refused: {e}")
except Exception as e:
    print(f"❌ SMTP test failed: {e}")
    
print("\n📋 Configuration Summary:")
print(f"   SMTP_HOST=mail.hexalyte.com")
print(f"   SMTP_PORT=587")
print(f"   SMTP_USER=vims@hexalyte.com")
print(f"   SMTP_USE_TLS=true")