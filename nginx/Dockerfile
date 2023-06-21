FROM nginx:alpine

RUN apk add --no-cache openssl

RUN mkdir -p /etc/nginx/ssl
RUN openssl req \
		-newkey rsa:4096 \
		-x509 \
		-sha256 \
		-days 3560 \
		-nodes \
		-out /etc/nginx/ssl/ft_transcendence.crt \
		-keyout /etc/nginx/ssl/ft_transcendence.key \
		-subj "/C=NL/ST=Noord-Holland/L=Amsterdam/O=Codam/OU=J4M/CN=codam.nl"

# COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80 443
