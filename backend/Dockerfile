FROM node:buster

RUN mkdir -p /home/backend-volume /usr/local/bin ;\
    export PATH=$PATH:/usr/local/bin
COPY ./backend-entrypoint.sh /usr/local/bin/

RUN apt-get install -y openssl

RUN openssl req \
		-newkey rsa:4096 \
		-x509 \
		-sha256 \
		-days 3560 \
		-nodes \
		-out /etc/ssl/certs/ft_transcendence.crt \
		-keyout /etc/ssl/private/ft_transcendence.key \
		-subj "/C=NL/ST=Noord-Holland/L=Amsterdam/O=Codam/OU=J4M/CN=*.codam.nl"

EXPOSE 4242
WORKDIR /home/backend-volume
ENTRYPOINT ["backend-entrypoint.sh"]
CMD ["npm", "run", "start:dev"]
