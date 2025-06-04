#!/bin/bash

BACKUP_DIR="${BACKUPS_PATH}"
DB_NAME="${POSTGRES_DB:-postgres}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_PASSWORD="${POSTGRES_PASSWORD:-postgres}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"
TIMESTAMP=$(date +%F_%H-%M-%S)

mkdir -p "$BACKUP_DIR"
PGPASSWORD="${DB_PASSWORD}" pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_DIR/db_$TIMESTAMP.sql"

find "$BACKUP_DIR" -type f -name "*.sql" -mtime +${BACKUP_RETENTION_DAYS} -exec rm {} \;