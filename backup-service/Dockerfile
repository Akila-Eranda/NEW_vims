FROM python:3.11-alpine

# Install necessary packages for MySQL client and cron
RUN apk add --no-cache \
    mysql-client \
    dcron \
    bash \
    curl \
    tzdata

# Set timezone
ENV TZ=Asia/Colombo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Create app directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backup scripts
COPY backup-mailer.py .
COPY backup-scheduler.sh .
COPY start-service.sh .

# Create backup and log directories
RUN mkdir -p /app/backup /app/logs

# Make scripts executable
RUN chmod +x backup-scheduler.sh start-service.sh

# Create cron log file
RUN touch /var/log/cron.log

# Start service
CMD ["./start-service.sh"]