FROM node:18-alpine

# Install necessary packages including build tools for native modules
RUN apk add --no-cache mysql-client python3 make g++

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install pm2 globally first
RUN npm install pm2 -g

# Install dependencies (this will compile bcrypt correctly with build tools)
RUN npm install --only=production

# Copy application code (including config files)
COPY . .

# Create a wait script for MySQL using environment variables
#RUN echo '#!/bin/sh' > /wait-for-mysql.sh && \
#    echo 'echo "Starting MySQL connection check..."' >> /wait-for-mysql.sh && \
#    echo 'echo "DB_HOST: $DB_HOST"' >> /wait-for-mysql.sh && \
#    echo 'echo "DB_PORT: $DB_PORT"' >> /wait-for-mysql.sh && \
#    echo 'echo "DB_USER: $DB_USER"' >> /wait-for-mysql.sh && \
#    echo 'echo "DB_NAME: $DB_NAME"' >> /wait-for-mysql.sh && \
#    echo 'counter=0' >> /wait-for-mysql.sh && \
#    echo 'max_attempts=30' >> /wait-for-mysql.sh && \
#    echo 'until mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1" > /dev/null 2>&1; do' >> /wait-for-mysql.sh && \
#    echo '  counter=$((counter + 1))' >> /wait-for-mysql.sh && \
#    echo '  if [ $counter -gt $max_attempts ]; then' >> /wait-for-mysql.sh && \
#    echo '    echo "ERROR: Failed to connect to MySQL after $max_attempts attempts"' >> /wait-for-mysql.sh && \
#    echo '    echo "Please check your database configuration"' >> /wait-for-mysql.sh && \
#    echo '    exit 1' >> /wait-for-mysql.sh && \
#    echo '  fi' >> /wait-for-mysql.sh && \
#    echo '  echo "Waiting for MySQL to be ready... (attempt $counter/$max_attempts)"' >> /wait-for-mysql.sh && \
#    echo '  sleep 3' >> /wait-for-mysql.sh && \
#    echo 'done' >> /wait-for-mysql.sh && \
#    echo 'echo "MySQL is ready!"' >> /wait-for-mysql.sh && \
#    chmod +x /wait-for-mysql.sh

EXPOSE 4444

# Start script that waits for MySQL then runs migrations and starts app
CMD ["/bin/sh", "-c", "npm run db:setup && pm2-runtime app.js"]