FROM node:buster

RUN mkdir -p /home/frontend-volume /usr/local/bin ;\
    export PATH=$PATH:/usr/local/bin
COPY ./frontend-entrypoint.sh /usr/local/bin/
EXPOSE 5173
WORKDIR /home/frontend-volume
ENTRYPOINT ["frontend-entrypoint.sh"]
CMD ["npm", "run", "dev", "--", "--port", "5173"]