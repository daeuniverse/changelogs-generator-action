FROM node:slim

ARG FUTURE_RELEASE

WORKDIR /app

COPY generate-changelogs.mjs ./
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
