FROM node:slim

WORKDIR /app

COPY entrypoint.sh generate-changelogs.mjs ./
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
