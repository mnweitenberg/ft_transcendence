FROM postgres:15.2-alpine

RUN mkdir -p /docker-entrypoint-initdb.d
COPY ./create-pong-user.sh /docker-entrypoint-initdb.d/
COPY ./init-db-tables.sql /docker-entrypoint-initdb.d/