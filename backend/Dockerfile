FROM node:buster

RUN apt-get update; apt-get upgrade -y; apt-get install openssl;

RUN mkdir -p /home/backend-volume /usr/local/bin ;\
    export PATH=$PATH:/usr/local/bin
COPY ./backend-entrypoint.sh /usr/local/bin/
EXPOSE 4242
WORKDIR /home/backend-volume

RUN mkdir /home/secrets; \
	openssl req \
		-newkey rsa:2048 \
		-x509 \
		-sha256 \
		-days 3650 \
		-nodes \
		-out /home/secrets/cert.pem \
		-keyout /home/secrets/key.pem \
		-subj "/C=NL/ST=Noord-Holland/L=Amsterdam/O=Codam/OU=Codam/CN=ft_transcendence";

ENTRYPOINT ["backend-entrypoint.sh"]
CMD ["npm", "run", "start:dev"]
