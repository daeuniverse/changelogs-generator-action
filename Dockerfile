FROM node:slim

WORKDIR /app

COPY generate-changelogs.mjs ./
COPY entrypoint.sh ./

RUN chmod +x entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
