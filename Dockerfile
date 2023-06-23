FROM node:slim

ARG FUTURE_RELEASE

WORKDIR /app

COPY generate-changelogs.mjs ./
# COPY entrypoint.sh /entrypoint.sh

# RUN chmod +x /entrypoint.sh

# ENTRYPOINT ["/entrypoint.sh"]
RUN echo $FUTURE_RELEASE

ENV FUTURE_RELEASE=$FUTURE_RELEASE

CMD [ "node", "generate-changelogs.mjs" ]
