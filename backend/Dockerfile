FROM node:buster

RUN mkdir -p /home/backend-volume /usr/local/bin ;\
    export PATH=$PATH:/usr/local/bin
COPY ./backend-entrypoint.sh /usr/local/bin/

EXPOSE 4242
WORKDIR /home/backend-volume
ENTRYPOINT ["backend-entrypoint.sh"]
CMD ["npm", "run", "start:dev"]
