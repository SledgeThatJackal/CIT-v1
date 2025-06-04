FROM postgres:17

RUN apt-get update && apt-get install -y cron && rm -rf /var/lib/apt/lists/*

COPY backup.sh /usr/local/bin/backup.sh
RUN chmod +x /usr/local/bin/backup.sh

COPY pg-cron /etc/cron.d/pg-cron
RUN chmod 0644 /etc/cron.d/pg-cron && crontab /etc/cron.d/pg-cron

RUN mkdir -p /var/log/cron

EXPOSE 5432

CMD cron && docker-entrypoint.sh postgres

LABEL org.opencontainers.image.source="https://github.com/sledgethatjackal/cit-prototype"
